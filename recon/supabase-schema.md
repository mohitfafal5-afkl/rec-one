# RE-CONE: Supabase Schema Reconnaissance & Live Site Comparison Report

> **Inspection Date:** 2026-10-29  
> **Supabase Target:** `https://ctwvelybgoqxwubdjpsd.supabase.co`  
> **Live Site Inspected:** `https://recone.base44.app`  

---

## 1. Existing Supabase Schema Inspection

### 1.1 Tables Found
- **`public.phones`** (Contains 10 rows)
- Probed potential tables: `storage`, `users`, `profiles`, `comparisons`, `feedback`, `newsletter`, `search`, `specs`, `spec_groups`, `phone_categories`, `recommendations`, `brands`, `categories`.
- **Result:** None of these secondary tables exist in `public`. Only `phones` exists.

### 1.2 Storage Buckets
- Checked `GET /storage/v1/bucket` with anon key.
- **Result:** `[]` (Empty array — no public or active storage buckets configured).

### 1.3 Table Structure: `public.phones`
Inspection of PostgREST entity headers and query payloads reveals the following columns:

| Column Name | Inferred Database Type | Nullable | Description / Value Pattern |
|---|---|---|---|
| `id` | `text` (Primary Key) | NO | Slug string e.g. `'samsung-galaxy-m56-5g'` |
| `name` | `text` | YES | Phone model name (e.g. `'Galaxy M56 5G'`) |
| `brand` | `text` | YES | Brand name (e.g. `'Samsung'`, `'OnePlus'`, `'Xiaomi'`) |
| `category` | `text` | YES | Value is generic `'smartphone'` for all 10 rows |
| `price_inr` | `integer` | YES | Retail price in INR (NULL for 7/10 rows) |
| `antutu` | `integer` | YES | AnTuTu benchmark score (NULL for 8/10 rows) |
| `battery_capacity` | `integer` | YES | Capacity in mAh (e.g. `5000`, `6000`, `7100`) |
| `has_jack` | `boolean` | YES | 3.5mm jack flag (NULL for all 10 rows) |
| `has_ois` | `boolean` | YES | Optical image stabilization (boolean or NULL) |
| `is_flat` | `boolean` | YES | Flat display flag (NULL or false for all 10 rows) |
| `is_clean_os` | `boolean` | YES | Clean OS flag (NULL for all 10 rows) |
| `is_compact` | `boolean` | YES | Compact flag (NULL for all 10 rows) |
| `display_type` | `text` | YES | e.g. `'Super AMOLED Plus'`, `'AMOLED'` |
| `display_size_inches` | `numeric(4,2)` | YES | e.g. `6.70`, `6.77` |
| `refresh_rate_hz` | `integer` | YES | Refresh rate e.g. `120` |
| `resolution` | `text` | YES | Resolution string e.g. `'1080 x 2340'` |
| `processor` | `text` | YES | SoC e.g. `'MediaTek Dimensity 8350 Apex'` |
| `ram_gb` | `numeric(4,2)` | YES | RAM in GB e.g. `12.00` |
| `storage_gb` | `integer` | YES | Flash storage e.g. `128` |
| `charging_w` | `integer` | YES | Wired charging wattage (NULL for all 10 rows) |
| `operating_system` | `text` | YES | OS name and shell (e.g. `'Android (One UI)'`) |
| `update_policy` | `text` | YES | Software update promise string |
| `rear_camera` | `text` | YES | Text optics description |
| `front_camera` | `text` | YES | Front optics description |
| `rear_camera_count` | `integer` | YES | Number of rear sensors (e.g. `2`, `3`) |
| `front_camera_count` | `integer` | YES | Number of front sensors (e.g. `1`) |
| `speaker_configuration` | `text` | YES | Audio configuration (NULL for all 10 rows) |
| `dimensions` | `text` | YES | Dimensions string e.g. `'162.0 x 77.3 x 7.2 mm'` |
| `weight_g` | `integer` | YES | Weight in grams (NULL for all 10 rows) |
| `image_url` | `text` | YES | Image URL (NULL for all 10 rows) |
| `source_url` | `text` | YES | Manufacturer product page link |
| `availability` | `text` | YES | Availability description |
| `search_text` | `text` | YES | Combined search terms |
| `data` | `jsonb` | YES | Raw scraped document blob |
| `updated_at` | `timestamptz` | YES | Last updated timestamp |

### 1.4 Existing Data (10 Devices)
1. `samsung-galaxy-m56-5g`
2. `oneplus-nord-ce5`
3. `redmi-note-14-pro-5g`
4. `motorola-edge-60-fusion`
5. `redmi-note-14-5g`
6. `oneplus-13r`
7. `oneplus-13`
8. `oppo-reno13-5g`
9. `vivo-v50`
10. `samsung-galaxy-a56-5g`

### 1.5 Row Level Security (RLS) & Foreign Keys
- **Foreign Keys:** None present on `phones`.
- **RLS Behavior:**
  - `GET /rest/v1/phones`: **Allowed (HTTP 200)** for anonymous role with `VITE_SUPABASE_ANON_KEY`.
  - `POST /rest/v1/phones`: **Denied (HTTP 401 Unauthorized)** when attempting inserts with `VITE_SUPABASE_ANON_KEY`.
  - RLS or PostgREST permissions enforce strict read-only access for anonymous users.

---

## 2. Live Site Data Model (`https://recone.base44.app`)

Inspection of the live deployment at `https://recone.base44.app` (specifically its client bundle `/assets/index-iKyhmk4D.js`) shows that it is an interactive comparison application containing **27 curated smartphones** with rich nested specification structures:

### 2.1 The 27 Curated Devices on Live Site
`samsung-galaxy-s24-ultra`, `samsung-galaxy-s24`, `samsung-galaxy-s23-fe`, `samsung-galaxy-a55`, `samsung-galaxy-a35`, `iphone-15-pro-max`, `iphone-15-pro`, `iphone-15`, `google-pixel-8a`, `google-pixel-8-pro`, `oneplus-12`, `oneplus-12r`, `oneplus-nord-4`, `xiaomi-14`, `poco-f6`, `poco-x6-pro`, `redmi-note-13-pro-plus`, `nothing-phone-2a-plus`, `nothing-phone-2`, `cmf-phone-1`, `vivo-v30-pro`, `iqoo-neo-9-pro`, `iqoo-12`, `realme-gt-6t`, `realme-12-pro-plus`, `sony-xperia-10-vi`, `asus-zenfone-10`.

### 2.2 Live Site Specification Hierarchy
Each device in the client runtime requires:
- **Identity & Archetype:** `id`, `name`, `brand`, `series`, `category` (`flagship-killers`, `compact-performers`, `battery-titans`, `camera-mavericks`, `clean-software`, `headphone-jack-saviors`), `categoryName`.
- **Commercial & Lab Benchmarks:** `price`, `priceFormatted`, `antutu`, `antutuFormatted`, `processor`, `ram`, `storage`.
- **Nested Display Spec (`display`):** `size`, `resolution`, `type`, `isFlat`, `refresh`, `brightness`, `protection`.
- **Nested Battery Spec (`battery`):** `capacity`, `capacityNum`, `charging`, `chargingTime`, `wirelessCharging`.
- **Nested Camera Spec (`camera`):** `main`, `mainSensor`, `ois`, `ultrawide`, `telephoto`, `secondary`, `selfie`, `video`.
- **Nested Audio Spec (`audio`):** `jack35mm`, `stereo`, `speakerDetails`.
- **Nested OS Spec (`os`):** `name`, `version`, `bloatware`, `updates`.
- **Nested Connectivity Spec (`connectivity`):** `fiveG`, `nfc`, `wifi`, `bluetooth`, `infrared`, `usb`.
- **Nested Build Spec (`build`):** `ipRating`, `weight`, `dimensions`, `material`.
- **Direct Filter Booleans:** `isFlat`, `hasJack`, `hasOIS`, `isCleanOS`, `isCompact`.
- **Editorial & Trust Attributes:** `editorialVerdict`, `highlights` (array), `pros` (array), `cons` (array), `similarPhones` (array), `sources` (array), `verifiedDate`, `releaseYear`.

---

## 3. Discrepancy & Mismatch Analysis

| Dimension | Supabase `phones` Table | Live Site Requirements (`recone.base44.app`) | Impact / Action Required |
|---|---|---|---|
| **Device Records** | 10 recently scraped 2026 devices (e.g. M56, Nord CE5, Reno13) | 27 curated flagship/midrange devices across 6 archetypes | **0% overlap**. The live site cannot populate its archetypes, comparison matchups, or quiz without the 27 curated devices. |
| **Category Representation** | Generic string `'smartphone'` | 6 strict archetypes (`flagship-killers`, `compact-performers`, `battery-titans`, etc.) | Category filter and quiz fail without archetype classification. |
| **Data Completeness** | Sparse columns (`price_inr`, `antutu`, `has_jack`, `is_flat`, `charging_w` mostly NULL) | 100% complete benchmark scores, prices, and filter flags | Sorting and filtering will drop almost all devices if NULL. |
| **Data Structure** | Flat partial columns + unindexed `data` JSONB | Nested spec objects (`display`, `battery`, `camera`, `os`, `build`, `audio`, `connectivity`) | UI components expect nested fields or formatted strings (`priceFormatted`, `antutuFormatted`). |
| **Editorial Content** | No editorial columns | `editorialVerdict`, `pros`, `cons`, `highlights`, `sources`, `verifiedDate` | Device detail page (`phone.html`) and modals will render blank editorial sections. |
| **Related Devices** | Not modeled | `similarPhones` array | Comparison recommendations cannot resolve siblings. |

---

## 4. Architectural Resolution for Phase 2 & 3

1. **Table Schema Evolution (`/supabase/migrations`):**
   - Provide a clean migration to align the schema with complete typing: either an enhanced `phones` table with typed columns / JSONB spec columns or dedicated normalized tables.
   - Retain full compatibility for both the existing 10 records and the 27 curated records.
   - Maintain explicit Row Level Security: public `SELECT` allowed, `INSERT`/`UPDATE`/`DELETE` denied to public/anon key.
   - Add B-Tree indexes on `category`, `price`, `antutu`, `battery_capacity_num` and partial indexes on boolean flags (`is_flat`, `has_jack`, `has_ois`, `is_clean_os`, `is_compact`).
2. **Seed Script:**
   - Full idempotent SQL seed script for the 27 curated phones and specs.
3. **Frontend Data-Access Layer (`src/lib/api/*`):**
   - Encapsulate all Supabase queries with `@supabase/supabase-js`.
   - Provide adapter transformation from Supabase row schema to the UI's expected `Phone` entity structure with defensive defaults for any missing/nullable fields.
