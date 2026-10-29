import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

function loadEnv() {
  const envPath = path.join(rootDir, '.env.local');
  const env = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        env[trimmed.substring(0, idx).trim()] = trimmed.substring(idx + 1).trim();
      }
    }
  }
  return env;
}

const env = loadEnv();
const databaseUrl = env.DATABASE_URL;

if (!databaseUrl || databaseUrl.includes('[YOUR-PASSWORD]')) {
  console.log('================================================================');
  console.log('NOTICE: DATABASE_URL is missing or contains placeholder [YOUR-PASSWORD]');
  console.log('================================================================');
  process.exit(1);
}

// Helper to extract password and project ref
function parseDbUrl(urlStr) {
  try {
    const u = new URL(urlStr);
    return {
      user: u.username,
      password: decodeURIComponent(u.password),
      host: u.hostname,
      port: u.port || 5432,
      database: u.pathname.replace(/^\//, '') || 'postgres'
    };
  } catch (e) {
    return null;
  }
}

const parsed = parseDbUrl(databaseUrl);

async function getClient() {
  // Strategy 1: Direct connection
  try {
    console.log('[RE-CONE] Connecting via direct database host...');
    const client = new pg.Client({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000
    });
    await client.connect();
    console.log('[RE-CONE] Connected via direct host.');
    return client;
  } catch (err) {
    console.warn(`[RE-CONE] Direct connection failed (${err.message}). Trying IPv4 Supabase Pooler...`);
  }

  // Strategy 2: Supabase IPv4 Pooler (Session mode port 5432 for DDL)
  if (parsed && parsed.password) {
    const poolerHost = 'aws-0-ap-south-1.pooler.supabase.com';
    const poolerUser = parsed.user.includes('.') ? parsed.user : `${parsed.user}.ctwvelybgoqxwubdjpsd`;
    console.log(`[RE-CONE] Connecting via IPv4 pooler ${poolerHost}:5432...`);
    const client = new pg.Client({
      host: poolerHost,
      port: 5432,
      user: poolerUser,
      password: parsed.password,
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000
    });
    await client.connect();
    console.log('[RE-CONE] Connected via Supabase IPv4 Session Pooler.');
    return client;
  }

  throw new Error('All database connection strategies exhausted.');
}

async function run() {
  let client;
  try {
    client = await getClient();

    const migrationFiles = [
      '20261029000001_create_recone_schema.sql',
      '20261029000002_seed_curated_phones.sql'
    ];

    for (const file of migrationFiles) {
      const filePath = path.join(rootDir, 'supabase', 'migrations', file);
      console.log(`\n[RE-CONE] Executing ${file}...`);
      const sql = fs.readFileSync(filePath, 'utf8');

      const start = Date.now();
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('COMMIT');
      console.log(`[RE-CONE] ✓ Successfully applied ${file} (${Date.now() - start}ms)`);
    }

    // Verify row counts
    const resCount = await client.query('SELECT count(*) FROM public.phones');
    const resCategories = await client.query('SELECT count(*) FROM public.categories');
    const resBrands = await client.query('SELECT count(*) FROM public.brands');

    console.log('\n================================================================');
    console.log('✓ ALL MIGRATIONS AND SEED SCRIPTS APPLIED SUCCESSFULLY!');
    console.log(`- Phones in database: ${resCount.rows[0].count}`);
    console.log(`- Categories configured: ${resCategories.rows[0].count}`);
    console.log(`- Brands configured: ${resBrands.rows[0].count}`);
    console.log('================================================================');

  } catch (err) {
    if (client) {
      await client.query('ROLLBACK').catch(() => {});
    }
    console.error('\n[RE-CONE] Migration execution failed:', err.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.end().catch(() => {});
    }
  }
}

run();
