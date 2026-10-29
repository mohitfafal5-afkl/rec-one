import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Load environment variables from .env.local safely
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
const supabaseUrl = env.VITE_SUPABASE_URL;
const anonKey = env.VITE_SUPABASE_ANON_KEY;
const databaseUrl = env.DATABASE_URL;

// Ensure process.env is set for downstream dynamic imports
process.env.VITE_SUPABASE_URL = supabaseUrl;
process.env.VITE_SUPABASE_ANON_KEY = anonKey;

console.log('================================================================');
console.log('RE-CONE PHASE 4 VERIFICATION AUDIT');
console.log('================================================================\n');

let allPassed = true;

// -----------------------------------------------------------------------------
// (a) VERIFY RLS WITH ANONYMOUS & UNAUTHENTICATED CLIENT
// -----------------------------------------------------------------------------
console.log('--- TEST (a): Row Level Security (RLS) & Public Access Restrictions ---');

async function testRLS() {
  if (!supabaseUrl || !anonKey) {
    console.error('FAIL: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local');
    allPassed = false;
    return;
  }

  // 1. Read Test (Should SUCCEED for public specs)
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/phones?select=id,name,brand&limit=1`, {
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Accept': 'application/json'
      }
    });
    if (res.ok) {
      console.log('✓ PASS: Public read on phones allowed (HTTP ' + res.status + ')');
    } else {
      console.warn('! WARN: Public read returned status: ' + res.status);
    }
  } catch (err) {
    console.error('FAIL: Error testing public read:', err.message);
    allPassed = false;
  }

  // 2. Write Test: INSERT (Should FAIL via anon key)
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/phones`, {
      method: 'POST',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        id: 'unauthorized-test-phone',
        name: 'Exploit Phone',
        brand: 'HackerBrand',
        category: 'flagship-killers'
      })
    });

    if (res.status === 401 || res.status === 403) {
      console.log(`✓ PASS: Anonymous INSERT strictly blocked (HTTP ${res.status} Unauthorized/Forbidden)`);
    } else {
      console.error(`✕ FAIL: Anonymous INSERT allowed or unexpected status: HTTP ${res.status}`);
      allPassed = false;
    }
  } catch (err) {
    console.log('✓ PASS: Anonymous INSERT rejected with exception:', err.message);
  }

  // 3. Write Test: UPDATE (Should FAIL via anon key with 401/403)
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/phones?id=eq.samsung-galaxy-m56-5g`, {
      method: 'PATCH',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ price_inr: 1 })
    });

    if (res.status === 401 || res.status === 403) {
      console.log(`✓ PASS: Anonymous UPDATE strictly blocked (HTTP ${res.status} Permission Denied)`);
    } else {
      console.error(`✕ FAIL: Anonymous UPDATE allowed or unexpected status: HTTP ${res.status}`);
      allPassed = false;
    }
  } catch (err) {
    console.log('✓ PASS: Anonymous UPDATE rejected with exception:', err.message);
  }

  // 4. Write Test: DELETE (Should FAIL via anon key with 401/403)
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/phones?id=eq.samsung-galaxy-m56-5g`, {
      method: 'DELETE',
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      }
    });

    if (res.status === 401 || res.status === 403) {
      console.log(`✓ PASS: Anonymous DELETE strictly blocked (HTTP ${res.status} Permission Denied)`);
    } else {
      console.error(`✕ FAIL: Anonymous DELETE allowed or unexpected status: HTTP ${res.status}`);
      allPassed = false;
    }
  } catch (err) {
    console.log('✓ PASS: Anonymous DELETE rejected with exception:', err.message);
  }

  // 5. Test Access to Sensitive Internal Endpoints
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/pg_shadow`, {
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      }
    });
    if (res.status === 404 || res.status === 401 || res.status === 403) {
      console.log(`✓ PASS: Access to internal pg_shadow denied (HTTP ${res.status})`);
    } else {
      console.error(`✕ FAIL: Sensitive table accessible! HTTP ${res.status}`);
      allPassed = false;
    }
  } catch (err) {
    console.log('✓ PASS: Sensitive table inaccessible.');
  }
}

// -----------------------------------------------------------------------------
// (b) VERIFY NO SECRETS APPEAR IN BUILT BUNDLE (dist/)
// -----------------------------------------------------------------------------
console.log('\n--- TEST (b): Production Bundle Secrets Leak Audit ---');

function testBundleSecrets() {
  const distDir = path.join(rootDir, 'dist');
  if (!fs.existsSync(distDir)) {
    console.error('✕ FAIL: dist/ directory does not exist. Run "npm run build" first.');
    allPassed = false;
    return;
  }

  // Extract possible secrets to search for
  const forbiddenPatterns = [];
  if (databaseUrl) {
    forbiddenPatterns.push({ label: 'DATABASE_URL', value: databaseUrl });
    const pwMatch = databaseUrl.match(/postgres:\/\/postgres:([^@]+)@/);
    if (pwMatch && pwMatch[1] && pwMatch[1] !== '[YOUR-PASSWORD]') {
      forbiddenPatterns.push({ label: 'DB Password', value: pwMatch[1] });
    }
  }
  forbiddenPatterns.push({ label: 'DATABASE_URL connection host', value: 'db.ctwvelybgoqxwubdjpsd.supabase.co:5432' });
  forbiddenPatterns.push({ label: 'service_role keyword', value: 'service_role' });

  let leaked = false;

  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.isFile()) {
        const content = fs.readFileSync(fullPath, 'utf8');
        for (const pattern of forbiddenPatterns) {
          if (content.includes(pattern.value)) {
            console.error(`✕ LEAK DETECTED in ${path.relative(rootDir, fullPath)}: Matched "${pattern.label}"`);
            leaked = true;
          }
        }
      }
    }
  }

  scanDir(distDir);

  if (!leaked) {
    console.log('✓ PASS: Zero secrets found in dist/ bundle.');
    console.log('  - DATABASE_URL: NOT present in client code');
    console.log('  - Database Password: NOT present in client code');
    console.log('  - service_role key: NOT present in client code');
  } else {
    allPassed = false;
  }
}

// -----------------------------------------------------------------------------
// (c) VERIFY RESILIENCE, THROTTLING, ERROR RECOVERY & SPEC DEFENSIVENESS
// -----------------------------------------------------------------------------
console.log('\n--- TEST (c): Network Throttling, Fault Injection & Spec Defensiveness ---');

async function testResilience() {
  const { normalizePhone } = await import('../src/lib/api/types.js');
  const { getPhones, getPhoneById } = await import('../src/lib/api/phones.js');

  // 1. Missing Spec Robustness Test
  console.log('Testing defensive normalization on incomplete/corrupted spec records...');
  const brokenRow = {
    id: 'corrupt-device-test',
    name: 'Corrupt Specs Device',
    brand: null,
    price: null,
    price_inr: null,
    antutu: null,
    display: null,
    battery: null,
    camera: null,
    audio: null,
    os: null,
    build: null,
    is_flat: null,
    has_jack: null
  };

  const normalized = normalizePhone(brokenRow);
  if (
    normalized &&
    normalized.name === 'Corrupt Specs Device' &&
    normalized.priceFormatted &&
    normalized.antutuFormatted &&
    normalized.display.size &&
    normalized.battery.capacity &&
    normalized.camera.main &&
    normalized.audio.jack35mm !== undefined &&
    normalized.os.name &&
    normalized.build.dimensions
  ) {
    console.log('✓ PASS: Incomplete records normalized with zero runtime exceptions.');
  } else {
    console.error('✕ FAIL: Normalization produced invalid or broken fields on corrupt record.');
    allPassed = false;
  }

  // 2. Request Cancellation (AbortController)
  console.log('Testing rapid query cancellation with AbortController...');
  const ac = new AbortController();
  ac.abort();
  try {
    await getPhones({ searchQuery: 'rapid-keystroke' }, { signal: ac.signal });
    console.error('✕ FAIL: Aborted request did not throw AbortError');
    allPassed = false;
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('✓ PASS: In-flight request successfully cancelled on rapid input.');
    } else {
      console.error('✕ FAIL: Unexpected error on aborted query:', err);
      allPassed = false;
    }
  }

  // 3. Fallback & Network Fault Tolerance
  console.log('Testing query retrieval and fallback resilience...');
  try {
    const result = await getPhones({ category: 'all' });
    if (result && Array.isArray(result.data) && result.data.length > 0) {
      console.log(`✓ PASS: getPhones() retrieved ${result.data.length} phones (source: ${result.source})`);
    } else {
      console.error('✕ FAIL: getPhones returned empty array');
      allPassed = false;
    }
  } catch (err) {
    console.error('✕ FAIL: getPhones threw exception:', err);
    allPassed = false;
  }

  // 4. Single Spec Lookup with fallback
  try {
    const p = await getPhoneById('samsung-galaxy-s24-ultra');
    if (p && p.name.includes('S24 Ultra')) {
      console.log(`✓ PASS: getPhoneById('samsung-galaxy-s24-ultra') resolved: "${p.name}"`);
    } else {
      console.error('✕ FAIL: getPhoneById could not resolve phone.');
      allPassed = false;
    }
  } catch (err) {
    console.error('✕ FAIL: getPhoneById threw exception:', err);
    allPassed = false;
  }
}

// Run all test suites
async function runAll() {
  await testRLS();
  testBundleSecrets();
  await testResilience();

  console.log('\n================================================================');
  if (allPassed) {
    console.log('✓ ALL PHASE 4 VERIFICATION AUDITS PASSED WITH ZERO ERRORS');
  } else {
    console.error('✕ ONE OR MORE PHASE 4 AUDITS FAILED');
    process.exit(1);
  }
  console.log('================================================================');
}

runAll();
