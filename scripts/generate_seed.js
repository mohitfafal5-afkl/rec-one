import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const phonesPath = path.join(__dirname, '..', 'data', 'phones.json');
const phones = JSON.parse(fs.readFileSync(phonesPath, 'utf8'));

function sqlEscape(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (typeof val === 'number') return val.toString();
  if (typeof val === 'object') return "'" + JSON.stringify(val).replace(/'/g, "''") + "'::jsonb";
  return "'" + String(val).replace(/'/g, "''") + "'";
}

function sqlArray(arr) {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return "'{}'::text[]";
  const items = arr.map(item => "'" + String(item).replace(/'/g, "''") + "'");
  return 'ARRAY[' + items.join(', ') + ']::text[]';
}

const schemaSql = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'migrations', '20261029000001_create_recone_schema.sql'), 'utf8');

let seedSql = `
-- ==============================================================================
-- RE-CONE Database Migration: Seed Curated 27 Smartphones
-- ==============================================================================

-- 1. SEED CATEGORIES
INSERT INTO public.categories (id, name, description) VALUES
  ('flagship-killers', 'Flagship Killers', 'Maximum computational horsepower per dollar. Top-tier silicon.'),
  ('compact-performers', 'Compact Performers', 'Ergonomic sub-6.4 inch daily drivers for one-handed use.'),
  ('battery-titans', 'Battery Titans', 'Built for relentless screen-on-time with 5000mAh+ and fast charging.'),
  ('camera-mavericks', 'Camera Mavericks', 'Hardware OIS, large sensors, and zero useless gimmick lenses.'),
  ('clean-software', 'Clean Software Purists', 'Bloatware-free, ad-free operating systems with long-term updates.'),
  ('headphone-jack-saviors', 'Headphone Jack Saviors', 'Dedicated 3.5mm analog audio jacks and micro-SD expansion.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 2. SEED BRANDS
INSERT INTO public.brands (id, name) VALUES
  ('samsung', 'Samsung'),
  ('apple', 'Apple'),
  ('google', 'Google'),
  ('oneplus', 'OnePlus'),
  ('xiaomi', 'Xiaomi'),
  ('poco', 'POCO'),
  ('nothing', 'Nothing'),
  ('vivo', 'Vivo'),
  ('iqoo', 'iQOO'),
  ('realme', 'Realme'),
  ('sony', 'Sony'),
  ('asus', 'Asus')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name;

-- 3. SEED 27 CURATED PHONES
`;

for (const p of phones) {
  const fields = [
    'id', 'name', 'brand', 'series', 'category', 'category_name',
    'price', 'price_formatted', 'antutu', 'antutu_formatted',
    'processor', 'ram', 'storage',
    'display', 'battery', 'camera', 'audio', 'os', 'connectivity', 'build',
    'biometrics', 'image_url',
    'is_flat', 'has_jack', 'has_ois', 'is_clean_os', 'is_compact',
    'ip_rating', 'weight', 'weight_g',
    'highlights', 'pros', 'cons', 'editorial_verdict',
    'release_year', 'similar_phones', 'verified_date', 'sources', 'data'
  ];

  const weightMatch = (p.weight || '').match(/(\d+)/);
  const weightG = weightMatch ? parseInt(weightMatch[1], 10) : null;

  const values = [
    sqlEscape(p.id),
    sqlEscape(p.name),
    sqlEscape(p.brand),
    sqlEscape(p.series),
    sqlEscape(p.category),
    sqlEscape(p.categoryName),
    p.price || 0,
    sqlEscape(p.priceFormatted || ('₹' + Number(p.price).toLocaleString('en-IN'))),
    p.antutu || 0,
    sqlEscape(p.antutuFormatted || ''),
    sqlEscape(p.processor),
    sqlEscape(p.ram),
    sqlEscape(p.storage),
    sqlEscape(p.display),
    sqlEscape(p.battery),
    sqlEscape(p.camera),
    sqlEscape(p.audio),
    sqlEscape(p.os),
    sqlEscape(p.connectivity),
    sqlEscape(p.build),
    sqlEscape(p.biometrics),
    sqlEscape(p.imageUrl),
    p.isFlat ? 'true' : 'false',
    p.hasJack ? 'true' : 'false',
    p.hasOIS ? 'true' : 'false',
    p.isCleanOS ? 'true' : 'false',
    p.isCompact ? 'true' : 'false',
    sqlEscape(p.ipRating),
    sqlEscape(p.weight),
    weightG !== null ? weightG : 'NULL',
    sqlArray(p.highlights),
    sqlArray(p.pros),
    sqlArray(p.cons),
    sqlEscape(p.editorialVerdict),
    p.releaseYear || 2024,
    sqlArray(p.similarPhones),
    sqlEscape(p.verifiedDate || '2026-Q1'),
    sqlArray(p.sources),
    sqlEscape(p)
  ];

  seedSql += `INSERT INTO public.phones (${fields.join(', ')}) VALUES (\n  ${values.join(',\n  ')}\n)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  brand = EXCLUDED.brand,
  series = EXCLUDED.series,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  price = EXCLUDED.price,
  price_formatted = EXCLUDED.price_formatted,
  antutu = EXCLUDED.antutu,
  antutu_formatted = EXCLUDED.antutu_formatted,
  processor = EXCLUDED.processor,
  ram = EXCLUDED.ram,
  storage = EXCLUDED.storage,
  display = EXCLUDED.display,
  battery = EXCLUDED.battery,
  camera = EXCLUDED.camera,
  audio = EXCLUDED.audio,
  os = EXCLUDED.os,
  connectivity = EXCLUDED.connectivity,
  build = EXCLUDED.build,
  biometrics = EXCLUDED.biometrics,
  image_url = EXCLUDED.image_url,
  is_flat = EXCLUDED.is_flat,
  has_jack = EXCLUDED.has_jack,
  has_ois = EXCLUDED.has_ois,
  is_clean_os = EXCLUDED.is_clean_os,
  is_compact = EXCLUDED.is_compact,
  ip_rating = EXCLUDED.ip_rating,
  weight = EXCLUDED.weight,
  weight_g = EXCLUDED.weight_g,
  highlights = EXCLUDED.highlights,
  pros = EXCLUDED.pros,
  cons = EXCLUDED.cons,
  editorial_verdict = EXCLUDED.editorial_verdict,
  release_year = EXCLUDED.release_year,
  similar_phones = EXCLUDED.similar_phones,
  verified_date = EXCLUDED.verified_date,
  sources = EXCLUDED.sources,
  data = EXCLUDED.data,
  updated_at = NOW();\n\n`;
}

// 1. Write standalone seed file
const seedPath = path.join(__dirname, '..', 'supabase', 'migrations', '20261029000002_seed_curated_phones.sql');
fs.writeFileSync(seedPath, seedSql, 'utf8');

// 2. Write all-in-one complete setup file (Schema + Seed combined)
const completePath = path.join(__dirname, '..', 'supabase', 'migrations', 'recone_complete_setup.sql');
const completeSql = `${schemaSql}\n\n${seedSql}`;
fs.writeFileSync(completePath, completeSql, 'utf8');

console.log('Successfully generated:');
console.log('1. ' + seedPath);
console.log('2. ' + completePath);
