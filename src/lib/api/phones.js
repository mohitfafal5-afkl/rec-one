import { supabase } from '../supabaseClient.js';
import { normalizePhone } from './types.js';

// Cache for fallback data if Supabase is cold, empty, or unmigrated
let localPhonesCache = null;

async function loadFallbackPhones() {
  if (localPhonesCache) return localPhonesCache;
  try {
    if (typeof window === 'undefined' && typeof process !== 'undefined') {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.resolve(process.cwd(), 'data', 'phones.json');
      if (fs.existsSync(filePath)) {
        const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        localPhonesCache = raw.map(normalizePhone);
        return localPhonesCache;
      }
    } else {
      const res = await fetch('/data/phones.json');
      if (res.ok) {
        const data = await res.json();
        localPhonesCache = data.map(normalizePhone);
        return localPhonesCache;
      }
    }
  } catch (err) {
    console.warn('[RE-CONE API] Could not load local fallback phones:', err);
  }
  return [];
}

/**
 * Fetch phones from Supabase with typed query filters, sorting, search,
 * and AbortController request cancellation.
 *
 * @param {Object} params - Query filters { category, activeFilterTags, searchQuery, sortBy }
 * @param {Object} options - Options { signal, forceFallback }
 * @returns {Promise<{ data: Array, source: 'supabase'|'fallback', error: null|string }>}
 */
export async function getPhones(params = {}, options = {}) {
  const { signal } = options;
  const { category = 'all', activeFilterTags = new Set(), searchQuery = '', sortBy = 'score-desc' } = params;

  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  // 1. Try Supabase if configured
  if (supabase) {
    try {
      let query = supabase.from('phones').select('*');

      // AbortSignal support on Supabase postgrest query
      if (signal) {
        query = query.abortSignal(signal);
      }

      // Archetype category filter at the database level
      if (category && category !== 'all') {
        if (category === 'headphone-jack-saviors') {
          query = query.eq('has_jack', true);
        } else {
          query = query.eq('category', category);
        }
      }

      // Boolean spec filters
      if (activeFilterTags && activeFilterTags.size > 0) {
        if (activeFilterTags.has('flat-display')) query = query.eq('is_flat', true);
        if (activeFilterTags.has('ois')) query = query.eq('has_ois', true);
        if (activeFilterTags.has('headphone-jack')) query = query.eq('has_jack', true);
        if (activeFilterTags.has('clean-os')) query = query.eq('is_clean_os', true);
        if (activeFilterTags.has('compact')) query = query.eq('is_compact', true);
        if (activeFilterTags.has('antutu-650k')) query = query.gte('antutu', 650000);
      }

      // Sorting at database level
      if (sortBy === 'score-desc') query = query.order('antutu', { ascending: false, nullsFirst: false });
      else if (sortBy === 'score-asc') query = query.order('antutu', { ascending: true, nullsFirst: false });
      else if (sortBy === 'price-asc') query = query.order('price', { ascending: true, nullsFirst: false });
      else if (sortBy === 'price-desc') query = query.order('price', { ascending: false, nullsFirst: false });

      const { data, error } = await query;

      if (!error && Array.isArray(data) && data.length > 0) {
        // If Supabase has data, normalize and apply client-side text search (for multi-token substring matching)
        let phones = data.map(normalizePhone);

        // Apply battery-5000 check if tag present
        if (activeFilterTags?.has('battery-5000')) {
          phones = phones.filter(p => p.battery.capacityNum >= 5000);
        }

        // Apply multi-token client search across all fields
        if (searchQuery && searchQuery.trim()) {
          const terms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
          phones = phones.filter(p => {
            const haystack = [
              p.name, p.brand, p.series, p.processor, p.category, p.categoryName,
              p.display.type, p.display.resolution, p.display.refresh,
              p.isFlat ? 'flat' : 'curved',
              p.hasOIS ? 'ois optical image stabilization' : 'eis',
              p.hasJack ? 'jack headphone 3.5mm analog audio' : 'no jack',
              p.isCleanOS ? 'clean stock zero bloatware' : 'custom vendor',
              p.isCompact ? 'compact ergonomic small' : 'large',
              p.camera.main, p.battery.capacity, p.os.name, p.storage, p.ipRating, p.antutuFormatted
            ].join(' ').toLowerCase();
            return terms.every(t => haystack.includes(t));
          });
        }

        return { data: phones, source: 'supabase', error: null };
      }

      if (error) {
        console.warn('[RE-CONE API] Supabase query error, activating graceful fallback:', error.message);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        throw err;
      }
      console.warn('[RE-CONE API] Supabase request failed, falling back:', err);
    }
  }

  // 2. Seamless Fallback Execution (keeps app 100% resilient before user approves DB migrations)
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  const allPhones = await loadFallbackPhones();

  let filtered = allPhones.filter(phone => {
    if (category !== 'all') {
      if (category === 'headphone-jack-saviors' && !phone.hasJack) return false;
      if (category !== 'headphone-jack-saviors' && phone.category !== category) return false;
    }

    if (searchQuery && searchQuery.trim()) {
      const terms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
      const haystack = [
        phone.name, phone.brand, phone.series, phone.processor, phone.category, phone.categoryName,
        phone.display.type, phone.display.resolution, phone.display.refresh,
        phone.isFlat ? 'flat' : 'curved',
        phone.hasOIS ? 'ois optical image stabilization' : 'eis',
        phone.hasJack ? 'jack headphone 3.5mm analog audio' : 'no jack',
        phone.isCleanOS ? 'clean stock zero bloatware' : 'custom vendor',
        phone.isCompact ? 'compact ergonomic small' : 'large',
        phone.camera.main, phone.battery.capacity, phone.os.name, phone.storage, phone.ipRating, phone.antutuFormatted
      ].join(' ').toLowerCase();
      if (!terms.every(t => haystack.includes(t))) return false;
    }

    if (activeFilterTags && activeFilterTags.size > 0) {
      for (const tag of activeFilterTags) {
        if (tag === 'flat-display' && !phone.isFlat) return false;
        if (tag === 'ois' && !phone.hasOIS) return false;
        if (tag === 'headphone-jack' && !phone.hasJack) return false;
        if (tag === 'battery-5000' && phone.battery.capacityNum < 5000) return false;
        if (tag === 'antutu-650k' && phone.antutu < 650000) return false;
        if (tag === 'clean-os' && !phone.isCleanOS) return false;
        if (tag === 'compact' && !phone.isCompact) return false;
      }
    }

    return true;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'score-desc') return b.antutu - a.antutu;
    if (sortBy === 'score-asc') return a.antutu - b.antutu;
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'battery-desc') return b.battery.capacityNum - a.battery.capacityNum;
    if (sortBy === 'weight-asc') {
      const wA = parseInt(a.weight, 10) || 999;
      const wB = parseInt(b.weight, 10) || 999;
      return wA - wB;
    }
    return 0;
  });

  return { data: filtered, source: 'fallback', error: null };
}

/**
 * Fetch a single phone by ID with AbortSignal cancellation support.
 */
export async function getPhoneById(phoneId, options = {}) {
  const { signal } = options;
  if (!phoneId) return null;

  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

  if (supabase) {
    try {
      let query = supabase.from('phones').select('*').eq('id', phoneId).single();
      if (signal) query = query.abortSignal(signal);
      const { data, error } = await query;
      if (!error && data) {
        return normalizePhone(data);
      }
    } catch (err) {
      if (err.name === 'AbortError') throw err;
      console.warn(`[RE-CONE API] Single fetch for ${phoneId} falling back:`, err);
    }
  }

  const all = await loadFallbackPhones();
  return all.find(p => p.id === phoneId) || null;
}

/**
 * Fetch multiple phones by IDs for side-by-side comparison.
 */
export async function getComparisonPhones(ids = [], options = {}) {
  const { signal } = options;
  if (!ids || ids.length === 0) return [];

  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

  if (supabase) {
    try {
      let query = supabase.from('phones').select('*').in('id', ids);
      if (signal) query = query.abortSignal(signal);
      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map(normalizePhone);
      }
    } catch (err) {
      if (err.name === 'AbortError') throw err;
      console.warn('[RE-CONE API] Comparison fetch falling back:', err);
    }
  }

  const all = await loadFallbackPhones();
  return ids.map(id => all.find(p => p.id === id)).filter(Boolean);
}
