/**
 * RE-CONE — Smartphone Comparison & Recommendation Platform
 * Core Vanilla JavaScript Application Engine with Supabase Data Layer
 * Verified Specifications, Multi-Device Comparison, Category Winners & Decision Quiz
 */

import { getPhones, getPhoneById, getComparisonPhones } from './src/lib/api/index.js';

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. TACTILE SPOTLIGHT TRACKER (requestAnimationFrame)
  // ==========================================================================
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 3;
  let isTicking = false;

  const updateSpotlight = () => {
    document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
    isTicking = false;
  };

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isTicking) {
      window.requestAnimationFrame(updateSpotlight);
      isTicking = true;
    }
  }, { passive: true });

  updateSpotlight();

  // ==========================================================================
  // 2. TOAST NOTIFICATION SYSTEM
  // ==========================================================================
  const toastContainer = document.getElementById('toast-notification');
  let toastTimeout = null;

  function showToast(message, duration = 3000) {
    if (!toastContainer) return;
    toastContainer.textContent = message;
    toastContainer.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastContainer.classList.remove('show');
    }, duration);
  }

  // ==========================================================================
  // 3. APPLICATION STATE & DOM REFERENCES
  // ==========================================================================
  let PHONES = [];

  const state = {
    selectedCategory: 'all',
    activeFilterTags: new Set(),
    searchQuery: '',
    sortBy: 'score-desc',
    comparisonList: [],
    diffOnly: false,
    quizAnswers: {
      useCase: null,
      dealbreaker: null,
      budget: null
    },
    currentQuizStep: 1
  };

  // DOM Elements
  const phonesGrid = document.getElementById('phones-grid');
  const searchInput = document.getElementById('phone-search-input');
  const sortSelect = document.getElementById('phone-sort-select');
  const resultCount = document.getElementById('filter-result-count');
  const resetFiltersBtn = document.getElementById('reset-filters-btn');
  const filterChips = document.querySelectorAll('.chip-btn');
  const categoryCards = document.querySelectorAll('.category-card');
  const activeFiltersBar = document.getElementById('active-filters-bar');

  const compareDrawer = document.getElementById('compare-drawer');
  const compareSelectedList = document.getElementById('compare-selected-list');
  const compareCountBadges = document.querySelectorAll('.compare-count-badge');
  const openCompareModalBtn = document.getElementById('open-compare-modal-btn');
  const clearCompareBtn = document.getElementById('clear-compare-btn');
  const headerCompareBtn = document.getElementById('header-compare-btn');

  const compareModal = document.getElementById('compare-modal');
  const specDetailModal = document.getElementById('spec-detail-modal');

  const quizStepIndicators = document.querySelectorAll('.step-indicator');
  const quizSteps = document.querySelectorAll('.quiz-step-content');
  const quizOptionCards = document.querySelectorAll('.quiz-option-card');
  const quizNextBtn = document.getElementById('quiz-next-btn');
  const quizPrevBtn = document.getElementById('quiz-prev-btn');
  const quizResultsView = document.getElementById('quiz-results-view');
  const restartQuizBtn = document.getElementById('restart-quiz-btn');

  // Hero Matchup & Quick Deck References
  const heroMatchupStage = document.getElementById('hero-matchup-stage');
  const matchupPillBtns = document.querySelectorAll('.matchup-pill-btn');
  const heroLaunchMatrixBtn = document.getElementById('hero-launch-matrix-btn');
  const deckPhone1 = document.getElementById('deck-phone-1');
  const deckPhone2 = document.getElementById('deck-phone-2');
  const deckPhone3 = document.getElementById('deck-phone-3');
  const deckCompareSubmitBtn = document.getElementById('deck-compare-submit-btn');
  const deckPresetTags = document.querySelectorAll('.deck-preset-tag');
  const deckSearchFilter = document.getElementById('deck-search-filter');
  const deckSwapBtn = document.getElementById('deck-swap-btn');

  let currentHeroMatchup = ['samsung-galaxy-s24-ultra', 'iphone-15-pro-max'];

  const MATCHUP_PRESETS = {
    's24u-vs-15pm': ['samsung-galaxy-s24-ultra', 'iphone-15-pro-max'],
    'op12-vs-iqoo12': ['oneplus-12', 'iqoo-12'],
    'poco-vs-nord': ['poco-f6', 'oneplus-nord-4']
  };

  // ==========================================================================
  // 4. URL SYNC FOR SHAREABLE COMPARISONS
  // ==========================================================================
  function syncComparisonURL() {
    try {
      const ids = state.comparisonList.map(p => p.id);
      const url = new URL(window.location);
      if (ids.length >= 2) {
        url.searchParams.set('compare', ids.join(','));
      } else {
        url.searchParams.delete('compare');
      }
      window.history.replaceState(null, '', url.toString());
    } catch (e) {
      // Quiet fail if history API restricted in iframe
    }
  }

  function checkURLForComparison() {
    try {
      const params = new URLSearchParams(window.location.search);
      const compareQuery = params.get('compare');
      if (compareQuery && PHONES.length > 0) {
        const ids = compareQuery.split(',').map(s => s.trim()).filter(Boolean);
        const matched = ids.map(id => PHONES.find(p => p.id === id)).filter(Boolean);
        if (matched.length >= 2) {
          state.comparisonList = matched.slice(0, 3);
          updateCompareDrawerUI();
          renderPhoneCards();
          openFullCompareModal();
        }
      }
    } catch (e) {
      console.warn('URL comparison parsing error:', e);
    }
  }

  // ==========================================================================
  // 5. HERO MATCHUP ENGINE
  // ==========================================================================
  function renderHeroMatchup(idA, idB) {
    if (!heroMatchupStage || PHONES.length === 0) return;
    const phoneA = PHONES.find(p => p.id === idA) || PHONES[0];
    const phoneB = PHONES.find(p => p.id === idB) || PHONES[1];
    if (!phoneA || !phoneB) return;

    currentHeroMatchup = [phoneA.id, phoneB.id];

    const antutuWinA = phoneA.antutu >= phoneB.antutu;
    const batteryWinA = (phoneA.battery.capacityNum || 0) >= (phoneB.battery.capacityNum || 0);

    heroMatchupStage.innerHTML = `
      <div class="matchup-dual-header">
        <div class="matchup-phone-col">
          <span class="matchup-phone-brand">${phoneA.brand}</span>
          <h3 class="matchup-phone-title">${phoneA.name}</h3>
          <span class="matchup-phone-price">${phoneA.priceFormatted || ('₹' + Number(phoneA.price).toLocaleString('en-IN'))}</span>
        </div>
        <div class="matchup-vs-badge">VS</div>
        <div class="matchup-phone-col" style="text-align: right;">
          <span class="matchup-phone-brand">${phoneB.brand}</span>
          <h3 class="matchup-phone-title">${phoneB.name}</h3>
          <span class="matchup-phone-price">${phoneB.priceFormatted || ('₹' + Number(phoneB.price).toLocaleString('en-IN'))}</span>
        </div>
      </div>

      <table class="matchup-metrics-table">
        <tbody>
          <tr>
            <td class="matchup-metric-label">Compute Silicon</td>
            <td class="matchup-val-cell">${phoneA.processor.split('(')[0].trim()}</td>
            <td class="matchup-val-cell" style="text-align: right;">${phoneB.processor.split('(')[0].trim()}</td>
          </tr>
          <tr>
            <td class="matchup-metric-label">AnTuTu Score</td>
            <td class="matchup-val-cell ${antutuWinA ? 'winner' : ''}">${phoneA.antutuFormatted} ${antutuWinA ? '★' : ''}</td>
            <td class="matchup-val-cell ${!antutuWinA ? 'winner' : ''}" style="text-align: right;">${!antutuWinA ? '★ ' : ''}${phoneB.antutuFormatted}</td>
          </tr>
          <tr>
            <td class="matchup-metric-label">Display & Hz</td>
            <td class="matchup-val-cell">${phoneA.display.size} ${phoneA.display.refresh}</td>
            <td class="matchup-val-cell" style="text-align: right;">${phoneB.display.size} ${phoneB.display.refresh}</td>
          </tr>
          <tr>
            <td class="matchup-metric-label">Battery Cell</td>
            <td class="matchup-val-cell ${batteryWinA ? 'winner' : ''}">${phoneA.battery.capacity}</td>
            <td class="matchup-val-cell ${!batteryWinA ? 'winner' : ''}" style="text-align: right;">${phoneB.battery.capacity}</td>
          </tr>
          <tr>
            <td class="matchup-metric-label">Primary Camera</td>
            <td class="matchup-val-cell">${phoneA.camera.main}</td>
            <td class="matchup-val-cell" style="text-align: right;">${phoneB.camera.main}</td>
          </tr>
          <tr>
            <td class="matchup-metric-label">OS / Software</td>
            <td class="matchup-val-cell">${phoneA.os.name}</td>
            <td class="matchup-val-cell" style="text-align: right;">${phoneB.os.name}</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  function initHeroMatchupListeners() {
    matchupPillBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.matchup;
        matchupPillBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (MATCHUP_PRESETS[key]) {
          const [idA, idB] = MATCHUP_PRESETS[key];
          renderHeroMatchup(idA, idB);

          if (deckPhone1) deckPhone1.value = idA;
          if (deckPhone2) deckPhone2.value = idB;
          if (deckPhone3) deckPhone3.value = '';
        }
      });
    });

    if (heroLaunchMatrixBtn) {
      heroLaunchMatrixBtn.addEventListener('click', () => {
        const pA = PHONES.find(p => p.id === currentHeroMatchup[0]);
        const pB = PHONES.find(p => p.id === currentHeroMatchup[1]);
        if (pA && pB) {
          state.comparisonList = [pA, pB];
          updateCompareDrawerUI();
          renderPhoneCards();
          openFullCompareModal();
        }
      });
    }
  }

  // ==========================================================================
  // 6. QUICK COMPARISON DECK SELECTORS & PRESETS
  // ==========================================================================
  function populateDeckSelects(searchQuery = '') {
    if (!deckPhone1 || !deckPhone2 || !deckPhone3 || PHONES.length === 0) return;

    const currentVal1 = deckPhone1.value || 'samsung-galaxy-s24-ultra';
    const currentVal2 = deckPhone2.value || 'iphone-15-pro-max';
    const currentVal3 = deckPhone3.value || '';

    const filterList = searchQuery.trim()
      ? PHONES.filter(p => {
          const q = searchQuery.toLowerCase();
          return p.name.toLowerCase().includes(q) ||
                 p.brand.toLowerCase().includes(q) ||
                 p.processor.toLowerCase().includes(q);
        })
      : PHONES;

    const createOptions = (defaultId, isOptional = false) => {
      let html = isOptional ? `<option value="">+ 3rd Phone (Optional)</option>` : `<option value="">Select Phone...</option>`;
      
      const brands = [...new Set(filterList.map(p => p.brand))].sort();
      brands.forEach(brand => {
        html += `<optgroup label="${brand}">`;
        filterList.filter(p => p.brand === brand).forEach(phone => {
          const selected = phone.id === defaultId ? 'selected' : '';
          const price = phone.priceFormatted || ('₹' + Number(phone.price).toLocaleString('en-IN'));
          html += `<option value="${phone.id}" ${selected}>${phone.name} (${price})</option>`;
        });
        html += `</optgroup>`;
      });
      return html;
    };

    deckPhone1.innerHTML = createOptions(currentVal1);
    deckPhone2.innerHTML = createOptions(currentVal2);
    deckPhone3.innerHTML = createOptions(currentVal3, true);

    // Fallback if current value was filtered out
    if (!deckPhone1.value && filterList.length > 0) deckPhone1.value = filterList[0].id;
    if (!deckPhone2.value && filterList.length > 1) deckPhone2.value = filterList[1].id;
  }

  function initDeckEventListeners() {
    const onDeckChange = () => {
      const idA = deckPhone1 ? deckPhone1.value : '';
      const idB = deckPhone2 ? deckPhone2.value : '';
      if (idA && idB && idA !== idB) {
        renderHeroMatchup(idA, idB);
      }
    };

    if (deckPhone1) deckPhone1.addEventListener('change', onDeckChange);
    if (deckPhone2) deckPhone2.addEventListener('change', onDeckChange);

    // Swap Button
    if (deckSwapBtn) {
      deckSwapBtn.addEventListener('click', () => {
        if (!deckPhone1 || !deckPhone2) return;
        const val1 = deckPhone1.value;
        const val2 = deckPhone2.value;
        deckPhone1.value = val2;
        deckPhone2.value = val1;
        onDeckChange();
      });
    }

    // Quick Live Search inside Deck
    if (deckSearchFilter) {
      deckSearchFilter.addEventListener('input', (e) => {
        populateDeckSelects(e.target.value);
      });
    }

    if (deckCompareSubmitBtn) {
      deckCompareSubmitBtn.addEventListener('click', () => {
        const id1 = deckPhone1 ? deckPhone1.value : '';
        const id2 = deckPhone2 ? deckPhone2.value : '';
        const id3 = deckPhone3 ? deckPhone3.value : '';

        if (!id1 || !id2) {
          alert('Please select at least two distinct smartphones to compare.');
          return;
        }

        if (id1 === id2 || (id3 && (id3 === id1 || id3 === id2))) {
          alert('Please select different smartphones for each slot.');
          return;
        }

        const selectedIds = [id1, id2];
        if (id3) selectedIds.push(id3);

        state.comparisonList = selectedIds.map(id => PHONES.find(p => p.id === id)).filter(Boolean);
        updateCompareDrawerUI();
        renderPhoneCards();
        openFullCompareModal();
      });
    }

    deckPresetTags.forEach(tag => {
      tag.addEventListener('click', () => {
        const p1 = tag.dataset.p1;
        const p2 = tag.dataset.p2;

        if (deckPhone1) deckPhone1.value = p1;
        if (deckPhone2) deckPhone2.value = p2;
        if (deckPhone3) deckPhone3.value = '';

        renderHeroMatchup(p1, p2);

        const phoneA = PHONES.find(p => p.id === p1);
        const phoneB = PHONES.find(p => p.id === p2);
        if (phoneA && phoneB) {
          state.comparisonList = [phoneA, phoneB];
          updateCompareDrawerUI();
          renderPhoneCards();
          openFullCompareModal();
        }
      });
    });
  }

  // ==========================================================================
  // 7. ACTIVE FILTERS BAR RENDERER
  // ==========================================================================
  function renderActiveFiltersBar() {
    if (!activeFiltersBar) return;

    const hasCategory = state.selectedCategory !== 'all';
    const hasTags = state.activeFilterTags.size > 0;
    const hasSearch = state.searchQuery.length > 0;

    if (!hasCategory && !hasTags && !hasSearch) {
      activeFiltersBar.style.display = 'none';
      activeFiltersBar.innerHTML = '';
      return;
    }

    activeFiltersBar.style.display = 'flex';

    const categoryNames = {
      'flagship-killers': 'Flagship Killers',
      'compact-performers': 'Compact Performers',
      'battery-titans': 'Battery Titans',
      'camera-mavericks': 'Camera Mavericks',
      'clean-software': 'Clean Software',
      'headphone-jack-saviors': '3.5mm Headphone Jack'
    };

    const tagNames = {
      'flat-display': 'Flat Display Only',
      'ois': 'Hardware OIS',
      'headphone-jack': '3.5mm Jack Included',
      'battery-5000': '5000mAh+ Cell',
      'antutu-650k': 'AnTuTu > 650k',
      'clean-os': 'Clean Stock OS',
      'compact': 'Compact (<6.4")'
    };

    let html = `<span class="active-filters-title">Active Filters:</span>`;

    if (hasCategory) {
      html += `
        <span class="active-filter-pill">
          Archetype: ${categoryNames[state.selectedCategory] || state.selectedCategory}
          <span class="active-filter-remove" data-remove-cat="${state.selectedCategory}" title="Clear category filter">✕</span>
        </span>
      `;
    }

    for (let tag of state.activeFilterTags) {
      html += `
        <span class="active-filter-pill">
          ${tagNames[tag] || tag}
          <span class="active-filter-remove" data-remove-tag="${tag}" title="Remove constraint">✕</span>
        </span>
      `;
    }

    if (hasSearch) {
      html += `
        <span class="active-filter-pill">
          Search: "${state.searchQuery}"
          <span class="active-filter-remove" data-clear-search="true" title="Clear search query">✕</span>
        </span>
      `;
    }

    activeFiltersBar.innerHTML = html;

    // Attach dismissal events
    activeFiltersBar.querySelectorAll('[data-remove-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.selectedCategory = 'all';
        document.querySelectorAll('.chip-btn[data-type="category"]').forEach(c => {
          c.classList.toggle('active', c.dataset.filter === 'all');
        });
        renderPhoneCards();
      });
    });

    activeFiltersBar.querySelectorAll('[data-remove-tag]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tag = btn.dataset.removeTag;
        state.activeFilterTags.delete(tag);
        const chip = document.querySelector(`.chip-btn[data-type="spec"][data-filter="${tag}"]`);
        if (chip) chip.classList.remove('active');
        renderPhoneCards();
      });
    });

    activeFiltersBar.querySelectorAll('[data-clear-search]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.searchQuery = '';
        if (searchInput) searchInput.value = '';
        renderPhoneCards();
      });
    });
  }

  // ==========================================================================
  // 8. CORE FILTER & RENDER ENGINE
  // ==========================================================================
  function getFilteredPhones() {
    return PHONES.filter(phone => {
      // Category filter
      if (state.selectedCategory !== 'all') {
        if (phone.category !== state.selectedCategory) {
          // Cross-compatibility for 3.5mm jack
          if (state.selectedCategory === 'headphone-jack-saviors' && !phone.hasJack) {
            return false;
          }
          if (state.selectedCategory !== 'headphone-jack-saviors') {
            return false;
          }
        }
      }

      // Enhanced multi-token search
      if (state.searchQuery) {
        const terms = state.searchQuery.split(/\s+/).filter(Boolean);
        const phoneString = [
          phone.name,
          phone.brand,
          phone.series,
          phone.processor,
          phone.category,
          phone.categoryName,
          phone.display.type,
          phone.display.resolution,
          phone.display.refresh,
          phone.isFlat ? 'flat' : 'curved',
          phone.hasOIS ? 'ois optical image stabilization' : 'eis',
          phone.hasJack ? 'jack headphone 3.5mm analog audio' : 'no jack',
          phone.isCleanOS ? 'clean stock zero bloatware' : 'custom vendor',
          phone.isCompact ? 'compact ergonomic small' : 'large',
          phone.camera.main,
          phone.battery.capacity,
          phone.os.name,
          phone.storage,
          phone.ipRating || '',
          phone.antutuFormatted
        ].join(' ').toLowerCase();

        const allTermsMatch = terms.every(term => phoneString.includes(term));
        if (!allTermsMatch) return false;
      }

      // Mandatory spec tags
      for (let tag of state.activeFilterTags) {
        if (tag === 'flat-display' && !phone.isFlat) return false;
        if (tag === 'ois' && !phone.hasOIS) return false;
        if (tag === 'headphone-jack' && !phone.hasJack) return false;
        if (tag === 'battery-5000' && (phone.battery.capacityNum || 0) < 5000) return false;
        if (tag === 'antutu-650k' && phone.antutu < 650000) return false;
        if (tag === 'clean-os' && !phone.isCleanOS) return false;
        if (tag === 'compact' && !phone.isCompact) return false;
      }

      return true;
    }).sort((a, b) => {
      if (state.sortBy === 'score-desc') return b.antutu - a.antutu;
      if (state.sortBy === 'score-asc') return a.antutu - b.antutu;
      if (state.sortBy === 'price-asc') return a.price - b.price;
      if (state.sortBy === 'price-desc') return b.price - a.price;
      if (state.sortBy === 'battery-desc') return (b.battery.capacityNum || 0) - (a.battery.capacityNum || 0);
      if (state.sortBy === 'weight-asc') {
        const wA = parseInt(a.weight) || 999;
        const wB = parseInt(b.weight) || 999;
        return wA - wB;
      }
      return 0;
    });
  }

  let activeSearchAbortController = null;

  async function renderPhoneCards() {
    if (!phonesGrid) return;

    // 1. Request Cancellation: Cancel any previous pending query
    if (activeSearchAbortController) {
      activeSearchAbortController.abort();
    }
    activeSearchAbortController = new AbortController();
    const signal = activeSearchAbortController.signal;

    renderActiveFiltersBar();

    // 2. Loading State: Display tactile loading spinner during query
    phonesGrid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 4rem 2rem; text-align: center; border: 1px solid var(--border-light); background-color: var(--bg-card); position: relative; z-index: 2;">
        <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted); display: inline-flex; align-items: center; justify-content: center; gap: 0.65rem;">
          <span class="spinner"></span>
          <span>Querying verified hardware specifications...</span>
        </div>
      </div>
    `;

    try {
      const response = await getPhones({
        category: state.selectedCategory,
        activeFilterTags: state.activeFilterTags,
        searchQuery: state.searchQuery,
        sortBy: state.sortBy
      }, { signal });

      const filtered = response.data || [];

      if (resultCount) {
        resultCount.textContent = `Showing ${filtered.length} of ${PHONES.length || 27} curated devices`;
      }

      // 3. Empty State: No devices match constraints
      if (filtered.length === 0) {
        phonesGrid.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 4rem 2rem; text-align: center; border: 1px solid var(--border-light); background-color: var(--bg-card); position: relative; z-index: 2;">
            <div style="font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--text-muted); margin-bottom: 0.5rem;">0 MATCHES FOUND</div>
            <h3 style="font-family: var(--font-serif); font-size: 1.75rem; color: var(--text-primary); margin-bottom: 1rem;">No device satisfies all selected constraints.</h3>
            <p style="font-size: 0.9375rem; color: var(--text-secondary); max-width: 480px; margin: 0 auto 1.5rem auto;">Try removing one of the strict hardware filters (e.g. 3.5mm jack or compact dimensions) to expand results.</p>
            <button class="btn btn-primary btn-sm" id="empty-state-reset-btn">Reset All Criteria</button>
          </div>
        `;
        const btn = document.getElementById('empty-state-reset-btn');
        if (btn && resetFiltersBtn) {
          btn.addEventListener('click', () => resetFiltersBtn.click());
        }
        return;
      }

      phonesGrid.innerHTML = filtered.map(phone => {
        const isCompared = state.comparisonList.some(item => item.id === phone.id);

        return `
          <article class="phone-card" data-id="${phone.id}">
            <div class="phone-card-top">
              <div>
                <div class="phone-brand-series">${phone.brand} · ${phone.series}</div>
                <h3 class="phone-title">${phone.name}</h3>
              </div>
              <div class="antutu-pill" title="Verified AnTuTu V10 Lab Benchmark">
                ★ ${phone.antutuFormatted}
              </div>
            </div>

            <div class="phone-specs-grid">
              <div class="spec-cell">
                <span class="spec-cell-label">SoC</span>
                <span class="spec-cell-val">${phone.processor.split('(')[0].trim()}</span>
              </div>
              <div class="spec-cell">
                <span class="spec-cell-label">Display</span>
                <span class="spec-cell-val">${phone.display.size} ${phone.isFlat ? 'Flat' : 'Curved'} ${phone.display.refresh}</span>
              </div>
              <div class="spec-cell">
                <span class="spec-cell-label">Battery</span>
                <span class="spec-cell-val">${phone.battery.capacity} (${phone.battery.charging.split('(')[0].trim()})</span>
              </div>
              <div class="spec-cell">
                <span class="spec-cell-label">Main Camera</span>
                <span class="spec-cell-val">${phone.camera.main} ${phone.camera.ois ? '(OIS)' : ''}</span>
              </div>
            </div>

            <div class="phone-badges-row">
              ${phone.isFlat ? '<span class="spec-badge highlight">Flat AMOLED</span>' : ''}
              ${phone.hasOIS ? '<span class="spec-badge highlight">Hardware OIS</span>' : ''}
              ${phone.hasJack ? '<span class="spec-badge highlight">3.5mm Jack</span>' : ''}
              ${phone.isCleanOS ? '<span class="spec-badge highlight">Clean OS</span>' : ''}
              ${phone.ipRating ? `<span class="spec-badge">${phone.ipRating}</span>` : ''}
            </div>

            <div class="phone-card-footer">
              <div class="phone-price-tag">
                <span class="tier">${phone.categoryName}</span>
                <span class="amount">${phone.priceFormatted || ('₹' + Number(phone.price).toLocaleString('en-IN'))}</span>
              </div>

              <div class="phone-actions">
                <label class="compare-checkbox-label ${isCompared ? 'selected' : ''}" title="Add to comparison tray">
                  <input type="checkbox" data-compare-id="${phone.id}" ${isCompared ? 'checked' : ''}>
                  <span>${isCompared ? 'Comparing' : 'Compare'}</span>
                </label>
                <a href="phone.html?id=${phone.id}" target="_blank" class="btn btn-outline btn-sm view-spec-btn" data-spec-id="${phone.id}">
                  Specs
                </a>
              </div>
            </div>
          </article>
        `;
      }).join('');

      attachCardEventListeners();
    } catch (err) {
      // Safely ignore cancelled queries on rapid keystrokes/clicks
      if (err.name === 'AbortError') return;

      console.error('[RE-CONE] Query exception:', err);

      // 4. Error State: Clear feedback and retry mechanism
      phonesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 4rem 2rem; text-align: center; border: 1px solid var(--border-dark); background-color: var(--bg-card); position: relative; z-index: 2;">
          <div class="eyebrow" style="color: #ff5555; margin-bottom: 0.5rem;">DATABASE NOTICE</div>
          <h3 style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--text-primary); margin-bottom: 0.75rem;">Failed to load hardware specifications</h3>
          <p style="font-size: 0.875rem; color: var(--text-secondary); max-width: 480px; margin: 0 auto 1.5rem auto;">${err.message || 'The database query was interrupted or encountered a network timeout.'}</p>
          <button class="btn btn-primary btn-sm" id="retry-query-btn">↻ Retry Query</button>
        </div>
      `;
      const retryBtn = document.getElementById('retry-query-btn');
      if (retryBtn) retryBtn.addEventListener('click', () => renderPhoneCards());
    }
  }

  function openPhoneSpecWindow(phoneId) {
    const width = 720;
    const height = 860;
    const left = Math.max(0, Math.round((window.screen.width - width) / 2));
    const top = Math.max(0, Math.round((window.screen.height - height) / 2));
    const targetUrl = `phone.html?id=${encodeURIComponent(phoneId)}`;
    const popup = window.open(
      targetUrl,
      `recone_spec_${phoneId.replace(/[^a-zA-Z0-9]/g, '_')}`,
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=no,toolbar=no,menubar=no`
    );
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      window.open(targetUrl, '_blank');
    } else {
      popup.focus();
    }
  }

  function attachCardEventListeners() {
    document.querySelectorAll('input[data-compare-id]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const id = e.target.dataset.compareId;
        const phone = PHONES.find(p => p.id === id);
        if (!phone) return;

        if (e.target.checked) {
          if (state.comparisonList.length >= 3) {
            showToast('Comparison tray limit reached (max 3 devices).');
            e.target.checked = false;
            return;
          }
          if (!state.comparisonList.some(p => p.id === id)) {
            state.comparisonList.push(phone);
            showToast(`Added ${phone.name} to comparison tray.`);
          }
        } else {
          state.comparisonList = state.comparisonList.filter(p => p.id !== id);
          showToast(`Removed ${phone.name} from comparison tray.`);
        }

        syncComparisonURL();
        updateCompareDrawerUI();
        renderPhoneCards();
      });
    });

    document.querySelectorAll('.view-spec-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.dataset.specId;
        openPhoneSpecWindow(id);
      });
    });
  }

  // ==========================================================================
  // 9. FILTER & SORT EVENT LISTENERS
  // ==========================================================================
  if (searchInput) {
    let debounceTimer = null;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        state.searchQuery = e.target.value.toLowerCase().trim();
        renderPhoneCards();
      }, 150);
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderPhoneCards();
    });
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      state.searchQuery = '';
      if (searchInput) searchInput.value = '';
      state.selectedCategory = 'all';
      state.activeFilterTags.clear();
      state.sortBy = 'score-desc';
      if (sortSelect) sortSelect.value = 'score-desc';

      filterChips.forEach(chip => {
        if (chip.dataset.filter === 'all' && chip.dataset.type === 'category') {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });

      renderPhoneCards();
      showToast('Filters reset to all devices.');
    });
  }

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const filterType = chip.dataset.type;
      const filterVal = chip.dataset.filter;

      if (filterType === 'category') {
        document.querySelectorAll('.chip-btn[data-type="category"]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.selectedCategory = filterVal;
      } else if (filterType === 'spec') {
        if (state.activeFilterTags.has(filterVal)) {
          state.activeFilterTags.delete(filterVal);
          chip.classList.remove('active');
        } else {
          state.activeFilterTags.add(filterVal);
          chip.classList.add('active');
        }
      }

      renderPhoneCards();
    });
  });

  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.category;
      state.selectedCategory = cat;

      document.querySelectorAll('.chip-btn[data-type="category"]').forEach(c => {
        if (c.dataset.filter === cat) {
          c.classList.add('active');
        } else {
          c.classList.remove('active');
        }
      });

      renderPhoneCards();

      const explorerSection = document.getElementById('spec-matrix-explorer');
      if (explorerSection) {
        explorerSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ==========================================================================
  // 10. COMPARISON TRAY & DRAWER
  // ==========================================================================
  function updateCompareDrawerUI() {
    const count = state.comparisonList.length;

    compareCountBadges.forEach(badge => {
      badge.textContent = count;
    });

    if (count > 0) {
      if (compareDrawer) compareDrawer.classList.add('open');
    } else {
      if (compareDrawer) compareDrawer.classList.remove('open');
    }

    if (compareSelectedList) {
      compareSelectedList.innerHTML = state.comparisonList.map(phone => `
        <span class="compare-pill-tag">
          ${phone.name}
          <span class="compare-remove-btn" data-remove-compare="${phone.id}" title="Remove device">✕</span>
        </span>
      `).join('');

      document.querySelectorAll('[data-remove-compare]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.dataset.removeCompare;
          state.comparisonList = state.comparisonList.filter(p => p.id !== id);
          syncComparisonURL();
          updateCompareDrawerUI();
          renderPhoneCards();
        });
      });
    }
  }

  if (clearCompareBtn) {
    clearCompareBtn.addEventListener('click', () => {
      state.comparisonList = [];
      syncComparisonURL();
      updateCompareDrawerUI();
      renderPhoneCards();
      showToast('Comparison tray cleared.');
    });
  }

  if (openCompareModalBtn) {
    openCompareModalBtn.addEventListener('click', () => {
      if (state.comparisonList.length < 2) {
        showToast('Please select at least 2 devices to compare.');
        return;
      }
      openFullCompareModal();
    });
  }

  if (headerCompareBtn) {
    headerCompareBtn.addEventListener('click', () => {
      if (state.comparisonList.length < 2) {
        const exp = document.getElementById('quick-compare-bar') || document.getElementById('spec-matrix-explorer');
        if (exp) exp.scrollIntoView({ behavior: 'smooth' });
        showToast('Select 2 or 3 phones to initiate comparison matrix.');
      } else {
        openFullCompareModal();
      }
    });
  }

  // ==========================================================================
  // 11. SPEC DETAIL MODAL (With Trust & Source Dates)
  // ==========================================================================
  function openSpecModal(phone) {
    if (!specDetailModal) return;
    const content = specDetailModal.querySelector('.modal-content-slot');
    if (!content) return;

    const sourcesHtml = (phone.sources || ['Manufacturer Specification Whitepaper', 'AnTuTu V10 Verified Lab Database'])
      .map(s => `<li>${s}</li>`).join('');

    content.innerHTML = `
      <div class="spec-modal-header">
        <div class="eyebrow">${phone.brand} · ${phone.series} · Verified ${phone.verifiedDate || '2026-Q1'}</div>
        <h2 class="spec-modal-title">${phone.name}</h2>
        <p class="spec-modal-sub">${phone.editorialVerdict}</p>
      </div>

      <div class="spec-sheet-sections">
        <div>
          <div class="spec-sheet-group-title">01 / Compute & Storage Architecture</div>
          <table class="spec-table-list">
            <tr><td>Processor (SoC)</td><td>${phone.processor}</td></tr>
            <tr><td>AnTuTu Benchmark</td><td>${phone.antutuFormatted} (~${phone.antutu.toLocaleString()} pts)</td></tr>
            <tr><td>System Memory</td><td>${phone.ram}</td></tr>
            <tr><td>Storage Standard</td><td>${phone.storage}</td></tr>
            <tr><td>OS / Software</td><td>${phone.os.name} (${phone.os.bloatware})</td></tr>
            <tr><td>Support Commitment</td><td>${phone.os.updates}</td></tr>
          </table>
        </div>

        <div>
          <div class="spec-sheet-group-title">02 / Display & Hardware Ergonomics</div>
          <table class="spec-table-list">
            <tr><td>Display Panel</td><td>${phone.display.size} ${phone.display.type} (${phone.display.resolution})</td></tr>
            <tr><td>Panel Contour</td><td>${phone.isFlat ? '100% Flat Screen (Zero Distortion)' : 'Curved Edge'}</td></tr>
            <tr><td>Refresh Rate</td><td>${phone.display.refresh}</td></tr>
            <tr><td>Peak Luminance</td><td>${phone.display.brightness}</td></tr>
            <tr><td>Chassis Weight</td><td>${phone.weight}</td></tr>
            <tr><td>Dimensions</td><td>${phone.build?.dimensions || 'N/A'}</td></tr>
            <tr><td>Ingress Protection</td><td>${phone.ipRating}</td></tr>
          </table>
        </div>

        <div>
          <div class="spec-sheet-group-title">03 / Optics & Acoustic Architecture</div>
          <table class="spec-table-list">
            <tr><td>Primary Optics</td><td>${phone.camera.main}</td></tr>
            <tr><td>Hardware OIS</td><td>${phone.hasOIS ? 'Included (Optical Image Stabilization)' : 'Not Included (EIS Only)'}</td></tr>
            <tr><td>Auxiliary Sensors</td><td>${phone.camera.secondary}</td></tr>
            <tr><td>Video Capture</td><td>${phone.camera.video}</td></tr>
            <tr><td>3.5mm Headphone Jack</td><td>${phone.hasJack ? 'Dedicated 3.5mm Analog Audio Port' : 'No 3.5mm Jack (USB-C / BT Audio)'}</td></tr>
            <tr><td>Speaker Array</td><td>${phone.audio.stereo ? 'Dual Stereo Speakers' : 'Single Loudspeaker'}</td></tr>
          </table>
        </div>

        <div>
          <div class="spec-sheet-group-title">04 / Endurance, Power & Pricing</div>
          <table class="spec-table-list">
            <tr><td>Battery Capacity</td><td>${phone.battery.capacity}</td></tr>
            <tr><td>Wired Charging Rate</td><td>${phone.battery.charging}</td></tr>
            <tr><td>Wireless Charging</td><td>${phone.battery.wirelessCharging ? 'Supported' : 'Not Supported'}</td></tr>
            <tr><td>Current Regional Price</td><td>${phone.priceFormatted || ('₹' + Number(phone.price).toLocaleString('en-IN'))}</td></tr>
          </table>
        </div>

        <div>
          <div class="spec-sheet-group-title">05 / Data Verification & Trust Sources</div>
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); line-height: 1.6;">
            <strong>Verification Date:</strong> ${phone.verifiedDate || '2026-Q1'} (Zero sponsored rankings)<br>
            <strong>Reliable Sources:</strong>
            <ul style="list-style: square; padding-left: 1.25rem; margin-top: 0.25rem;">
              ${sourcesHtml}
            </ul>
          </div>
        </div>
      </div>
    `;

    specDetailModal.classList.add('active');
  }

  // ==========================================================================
  // 12. ADVANCED SIDE-BY-SIDE MATRIX (Winners, Diff Toggle, Dynamic Verdict)
  // ==========================================================================
  function calculateWinners(list) {
    if (list.length < 2) return {};

    // 1. AnTuTu winner
    let maxAntutu = -1;
    list.forEach(p => { if (p.antutu > maxAntutu) maxAntutu = p.antutu; });

    // 2. Battery capacity winner
    let maxBattery = -1;
    list.forEach(p => {
      const cap = p.battery.capacityNum || 0;
      if (cap > maxBattery) maxBattery = cap;
    });

    // 3. Charging wattage winner
    let maxCharging = -1;
    list.forEach(p => {
      const match = (p.battery.charging || '').match(/(\d+)\s*W/i);
      const w = match ? parseInt(match[1]) : 0;
      if (w > maxCharging) maxCharging = w;
    });

    // 4. Weight winner (lightest wins ergonomics)
    let minWeight = 999;
    list.forEach(p => {
      const match = (p.weight || '').match(/(\d+(\.\d+)?)/);
      const w = match ? parseFloat(match[1]) : 999;
      if (w < minWeight) minWeight = w;
    });

    // 5. Price winner (lowest price wins value)
    let minPrice = 9999999;
    list.forEach(p => {
      if (p.price < minPrice) minPrice = p.price;
    });

    // 6. Refresh rate winner
    let maxRefresh = 0;
    list.forEach(p => {
      const match = (p.display.refresh || '').match(/(\d+)\s*Hz/i);
      const hz = match ? parseInt(match[1]) : 60;
      if (hz > maxRefresh) maxRefresh = hz;
    });

    return { maxAntutu, maxBattery, maxCharging, minWeight, minPrice, maxRefresh };
  }

  function generateAutomatedVerdict(list) {
    if (list.length < 2) return '';

    const antutuLeader = [...list].sort((a, b) => b.antutu - a.antutu)[0];
    const batteryLeader = [...list].sort((a, b) => (b.battery.capacityNum || 0) - (a.battery.capacityNum || 0))[0];
    const priceLeader = [...list].sort((a, b) => a.price - b.price)[0];
    const weightLeader = [...list].sort((a, b) => (parseInt(a.weight) || 999) - (parseInt(b.weight) || 999))[0];

    let lines = [];
    lines.push(`<strong>Raw Silicon Horsepower:</strong> ${antutuLeader.name} takes the computational crown with ${antutuLeader.antutuFormatted} AnTuTu score driven by ${antutuLeader.processor.split('(')[0].trim()}.`);

    if (batteryLeader.id !== antutuLeader.id) {
      lines.push(`<strong>Endurance & Longevity:</strong> ${batteryLeader.name} provides superior power security with a ${batteryLeader.battery.capacity} cell and ${batteryLeader.battery.charging}.`);
    }

    lines.push(`<strong>Ergonomic Handfeel:</strong> ${weightLeader.name} is the most pocketable daily driver at ${weightLeader.weight} with a ${weightLeader.display.size} ${weightLeader.isFlat ? 'flat' : 'curved'} display.`);
    lines.push(`<strong>Value Proposition:</strong> ${priceLeader.name} (${priceLeader.priceFormatted || '₹' + priceLeader.price}) delivers the highest hardware specification-to-rupee ratio in this clash.`);

    return lines.map(l => `<p style="margin-bottom: 0.5rem;">${l}</p>`).join('');
  }

  function openFullCompareModal() {
    if (!compareModal) return;
    const slot = compareModal.querySelector('.modal-content-slot');
    if (!slot) return;

    const list = state.comparisonList;
    if (list.length < 2) {
      showToast('Select at least two devices to compare.');
      return;
    }

    syncComparisonURL();

    const winners = calculateWinners(list);
    const verdictHtml = generateAutomatedVerdict(list);

    // Helper for winner cell determination
    const isAntutuWinner = (p) => p.antutu === winners.maxAntutu && list.filter(x => x.antutu === winners.maxAntutu).length < list.length;
    const isBatteryWinner = (p) => (p.battery.capacityNum || 0) === winners.maxBattery && list.filter(x => (x.battery.capacityNum || 0) === winners.maxBattery).length < list.length;
    const isChargingWinner = (p) => {
      const match = (p.battery.charging || '').match(/(\d+)\s*W/i);
      const w = match ? parseInt(match[1]) : 0;
      return w === winners.maxCharging && list.filter(x => ((x.battery.charging || '').match(/(\d+)\s*W/i) || [0,0])[1] == w).length < list.length;
    };
    const isWeightWinner = (p) => {
      const match = (p.weight || '').match(/(\d+(\.\d+)?)/);
      const w = match ? parseFloat(match[1]) : 999;
      return w === winners.minWeight && list.filter(x => parseFloat((x.weight || '').match(/(\d+(\.\d+)?)/)?.[1]) == w).length < list.length;
    };
    const isPriceWinner = (p) => p.price === winners.minPrice && list.filter(x => x.price === winners.minPrice).length < list.length;
    const isRefreshWinner = (p) => {
      const match = (p.display.refresh || '').match(/(\d+)\s*Hz/i);
      const hz = match ? parseInt(match[1]) : 60;
      return hz === winners.maxRefresh && list.filter(x => ((x.display.refresh || '').match(/(\d+)\s*Hz/i) || [0,0])[1] == hz).length < list.length;
    };

    // Helper to test if all items in row are identical
    const allIdentical = (fn) => {
      const first = fn(list[0]);
      return list.every(p => fn(p) === first);
    };

    const rowAntutuIdentical = allIdentical(p => p.antutu);
    const rowSocIdentical = allIdentical(p => p.processor);
    const rowDisplayIdentical = allIdentical(p => `${p.display.size} ${p.display.type} ${p.isFlat ? 'Flat' : 'Curved'}`);
    const rowRefreshIdentical = allIdentical(p => p.display.refresh);
    const rowBatteryIdentical = allIdentical(p => `${p.battery.capacity} ${p.battery.charging}`);
    const rowCameraIdentical = allIdentical(p => `${p.camera.main} ${p.hasOIS}`);
    const rowJackIdentical = allIdentical(p => p.hasJack);
    const rowOsIdentical = allIdentical(p => p.os.name);
    const rowUpdatesIdentical = allIdentical(p => p.os.updates);
    const rowIpIdentical = allIdentical(p => p.ipRating);
    const rowWeightIdentical = allIdentical(p => p.weight);

    // Build optional 3rd slot options if only 2 phones compared
    const unselectedPhones = PHONES.filter(p => !list.some(item => item.id === p.id));
    const addSlotHeader = list.length < 3 ? `
      <th style="vertical-align: middle; text-align: center; background-color: var(--bg-card); min-width: 170px;">
        <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); margin-bottom: 0.5rem;">+ ADD 3RD PHONE</div>
        <select id="modal-add-phone-select" class="deck-select" style="font-size: 0.72rem; padding: 0.4rem;">
          <option value="">Select Device...</option>
          ${unselectedPhones.map(p => `<option value="${p.id}">${p.name} (${p.priceFormatted || '₹' + p.price})</option>`).join('')}
        </select>
      </th>
    ` : '';

    const addSlotTd = list.length < 3 ? `<td style="background-color: var(--bg-secondary); text-align: center; color: var(--text-muted); font-size: 0.75rem;">—</td>` : '';

    slot.innerHTML = `
      <div class="spec-modal-header">
        <div class="eyebrow">Direct Technical Audit // 2026 Verified Standards</div>
        <h2 class="spec-modal-title">Side-by-Side Hardware Matrix</h2>
        <p class="spec-modal-sub">Comparing ${list.length} curated devices with automatic category winner highlights and trade-off synthesis.</p>
      </div>

      <!-- Comparison Toolbar -->
      <div class="compare-toolbar">
        <label class="compare-diff-toggle" title="Hide rows where all selected devices have identical specifications">
          <input type="checkbox" id="diff-only-checkbox" ${state.diffOnly ? 'checked' : ''}>
          <span>Show Differences Only</span>
        </label>

        <div style="display: flex; gap: 0.75rem; align-items: center;">
          <button type="button" class="share-compare-btn" id="copy-compare-link-btn" title="Copy shareable link with current selection">
            🔗 Copy Shareable Link
          </button>
          <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
            (${list.length}/3 Devices)
          </span>
        </div>
      </div>

      <div style="overflow-x: auto;">
        <table class="compare-matrix-table" id="compare-matrix-table-el">
          <thead>
            <tr>
              <th scope="col">Specification</th>
              ${list.map(p => `
                <th scope="col" class="col-header-cell">
                  <button class="col-remove-btn" data-drop-compare="${p.id}" title="Remove ${p.name} from comparison">✕</button>
                  <div style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">${p.name}</div>
                  <div style="font-family: var(--font-mono); font-weight: 700; color: var(--text-primary); font-size: 0.85rem;">
                    ${p.priceFormatted || ('₹' + Number(p.price).toLocaleString('en-IN'))}
                    ${isPriceWinner(p) ? '<span class="winner-badge-pill">★ Best Value</span>' : ''}
                  </div>
                </th>
              `).join('')}
              ${addSlotHeader}
            </tr>
          </thead>
          <tbody>
            <tr class="spec-row ${rowAntutuIdentical ? 'identical-row' : ''} ${rowAntutuIdentical && state.diffOnly ? 'hidden-diff' : ''}">
              <td>AnTuTu V10 Lab Benchmark</td>
              ${list.map(p => `
                <td class="${isAntutuWinner(p) ? 'winner-cell' : ''}">
                  <strong>${p.antutuFormatted}</strong> (~${p.antutu.toLocaleString()} pts)
                  ${isAntutuWinner(p) ? '<span class="winner-badge-pill">★ Winner</span>' : ''}
                </td>
              `).join('')}
              ${addSlotTd}
            </tr>

            <tr class="spec-row ${rowSocIdentical ? 'identical-row' : ''} ${rowSocIdentical && state.diffOnly ? 'hidden-diff' : ''}">
              <td>Processor Silicon</td>
              ${list.map(p => `
                <td>
                  <strong>${p.processor}</strong><br>
                  <span style="color:var(--text-secondary); font-size:0.75rem;">${p.ram} · ${p.storage}</span>
                </td>
              `).join('')}
              ${addSlotTd}
            </tr>

            <tr class="spec-row ${rowDisplayIdentical ? 'identical-row' : ''} ${rowDisplayIdentical && state.diffOnly ? 'hidden-diff' : ''}">
              <td>Display Architecture</td>
              ${list.map(p => `
                <td>
                  ${p.display.size} ${p.display.type}<br>
                  <span style="color:var(--text-secondary); font-size:0.75rem;">${p.display.resolution} (${p.isFlat ? '100% Flat' : 'Curved'})</span>
                </td>
              `).join('')}
              ${addSlotTd}
            </tr>

            <tr class="spec-row ${rowRefreshIdentical ? 'identical-row' : ''} ${rowRefreshIdentical && state.diffOnly ? 'hidden-diff' : ''}">
              <td>Refresh Rate & Lumens</td>
              ${list.map(p => `
                <td class="${isRefreshWinner(p) ? 'winner-cell' : ''}">
                  <strong>${p.display.refresh}</strong> · ${p.display.brightness}
                  ${isRefreshWinner(p) ? '<span class="winner-badge-pill">★ Winner</span>' : ''}
                </td>
              `).join('')}
              ${addSlotTd}
            </tr>

            <tr class="spec-row ${rowBatteryIdentical ? 'identical-row' : ''} ${rowBatteryIdentical && state.diffOnly ? 'hidden-diff' : ''}">
              <td>Battery & Fast Charging</td>
              ${list.map(p => `
                <td class="${isBatteryWinner(p) || isChargingWinner(p) ? 'winner-cell' : ''}">
                  <strong>${p.battery.capacity}</strong>
                  ${isBatteryWinner(p) ? '<span class="winner-badge-pill">★ Max mAh</span>' : ''}<br>
                  <span style="color:var(--text-secondary); font-size:0.75rem;">${p.battery.charging}</span>
                  ${isChargingWinner(p) ? '<span class="winner-badge-pill">★ Fastest</span>' : ''}
                </td>
              `).join('')}
              ${addSlotTd}
            </tr>

            <tr class="spec-row ${rowCameraIdentical ? 'identical-row' : ''} ${rowCameraIdentical && state.diffOnly ? 'hidden-diff' : ''}">
              <td>Optics & Stabilization</td>
              ${list.map(p => `
                <td>
                  <strong>${p.camera.main}</strong><br>
                  <span style="font-weight:600; color:var(--text-primary); font-size:0.75rem;">${p.hasOIS ? '✓ Hardware OIS' : '✕ EIS Only'}</span><br>
                  <span style="color:var(--text-muted); font-size:0.72rem;">${p.camera.secondary}</span>
                </td>
              `).join('')}
              ${addSlotTd}
            </tr>

            <tr class="spec-row ${rowJackIdentical ? 'identical-row' : ''} ${rowJackIdentical && state.diffOnly ? 'hidden-diff' : ''}">
              <td>3.5mm Headphone Jack</td>
              ${list.map(p => `
                <td class="${p.hasJack ? 'winner-cell' : ''}">
                  <strong>${p.hasJack ? '✓ Included (Analog Audio)' : '✕ No 3.5mm Jack'}</strong>
                  ${p.hasJack && !rowJackIdentical ? '<span class="winner-badge-pill">★ Feature</span>' : ''}
                </td>
              `).join('')}
              ${addSlotTd}
            </tr>

            <tr class="spec-row ${rowOsIdentical ? 'identical-row' : ''} ${rowOsIdentical && state.diffOnly ? 'hidden-diff' : ''}">
              <td>OS & Software Experience</td>
              ${list.map(p => `
                <td class="${p.isCleanOS && !rowOsIdentical ? 'winner-cell' : ''}">
                  <strong>${p.os.name}</strong><br>
                  <span style="color:var(--text-secondary); font-size:0.75rem;">${p.os.bloatware}</span>
                  ${p.isCleanOS && !rowOsIdentical ? '<span class="winner-badge-pill">★ Clean OS</span>' : ''}
                </td>
              `).join('')}
              ${addSlotTd}
            </tr>

            <tr class="spec-row ${rowUpdatesIdentical ? 'identical-row' : ''} ${rowUpdatesIdentical && state.diffOnly ? 'hidden-diff' : ''}">
              <td>Software Lifecycle</td>
              ${list.map(p => `
                <td><strong>${p.os.updates}</strong></td>
              `).join('')}
              ${addSlotTd}
            </tr>

            <tr class="spec-row ${rowIpIdentical ? 'identical-row' : ''} ${rowIpIdentical && state.diffOnly ? 'hidden-diff' : ''}">
              <td>Ingress Submersion</td>
              ${list.map(p => `
                <td><strong>${p.ipRating}</strong></td>
              `).join('')}
              ${addSlotTd}
            </tr>

            <tr class="spec-row ${rowWeightIdentical ? 'identical-row' : ''} ${rowWeightIdentical && state.diffOnly ? 'hidden-diff' : ''}">
              <td>Chassis Weight & Build</td>
              ${list.map(p => `
                <td class="${isWeightWinner(p) ? 'winner-cell' : ''}">
                  <strong>${p.weight}</strong>
                  ${isWeightWinner(p) ? '<span class="winner-badge-pill">★ Lightest</span>' : ''}<br>
                  <span style="color:var(--text-muted); font-size:0.72rem;">${p.build?.material || ''}</span>
                </td>
              `).join('')}
              ${addSlotTd}
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Dynamic Automated Verdict Box -->
      <div class="compare-verdict-box">
        <div class="compare-verdict-title">
          <span>RE-CONE Technical Verdict // Synthesis</span>
        </div>
        <div class="compare-verdict-body">
          ${verdictHtml}
        </div>
      </div>
    `;

    // Event: Differences Only Toggle
    const diffCheckbox = slot.querySelector('#diff-only-checkbox');
    if (diffCheckbox) {
      diffCheckbox.addEventListener('change', (e) => {
        state.diffOnly = e.target.checked;
        slot.querySelectorAll('tr.identical-row').forEach(row => {
          row.classList.toggle('hidden-diff', state.diffOnly);
        });
      });
    }

    // Event: Copy Shareable Link
    const copyBtn = slot.querySelector('#copy-compare-link-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const url = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(() => {
            showToast('✓ Comparison link copied to clipboard!');
          }).catch(() => {
            prompt('Copy comparison URL:', url);
          });
        } else {
          prompt('Copy comparison URL:', url);
        }
      });
    }

    // Event: Drop column button
    slot.querySelectorAll('[data-drop-compare]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.dropCompare;
        state.comparisonList = state.comparisonList.filter(p => p.id !== id);
        updateCompareDrawerUI();
        renderPhoneCards();
        if (state.comparisonList.length >= 2) {
          openFullCompareModal();
        } else {
          compareModal.classList.remove('active');
          showToast('Comparison requires at least 2 phones.');
        }
      });
    });

    // Event: Add 3rd Phone in Modal
    const addSelect = slot.querySelector('#modal-add-phone-select');
    if (addSelect) {
      addSelect.addEventListener('change', (e) => {
        const id = e.target.value;
        if (!id) return;
        const phone = PHONES.find(p => p.id === id);
        if (phone && state.comparisonList.length < 3) {
          state.comparisonList.push(phone);
          updateCompareDrawerUI();
          renderPhoneCards();
          openFullCompareModal();
          showToast(`Added ${phone.name} to comparison.`);
        }
      });
    }

    compareModal.classList.add('active');
  }

  // Close modals on click overlay or close button
  document.querySelectorAll('.modal-close-btn, .modal-overlay').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el || e.target.closest('.modal-close-btn')) {
        document.querySelectorAll('.modal-overlay').forEach(modal => modal.classList.remove('active'));
      }
    });
  });

  // Accessible Escape Key to close modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(modal => {
        modal.classList.remove('active');
      });
    }
  });

  // ==========================================================================
  // 13. RECOMMENDATION ENGINE QUIZ (Up to 3 Phones with Trade-offs)
  // ==========================================================================
  quizOptionCards.forEach(card => {
    card.addEventListener('click', () => {
      const step = card.dataset.step;
      const value = card.dataset.value;

      const parentGrid = card.closest('.quiz-options-grid');
      if (parentGrid) {
        parentGrid.querySelectorAll('.quiz-option-card').forEach(c => c.classList.remove('selected'));
      }
      card.classList.add('selected');

      if (step === '1') state.quizAnswers.useCase = value;
      if (step === '2') state.quizAnswers.dealbreaker = value;
      if (step === '3') state.quizAnswers.budget = value;

      if (quizNextBtn) quizNextBtn.disabled = false;
    });
  });

  if (quizNextBtn) {
    quizNextBtn.addEventListener('click', () => {
      if (state.currentQuizStep < 3) {
        state.currentQuizStep++;
        updateQuizStepUI();
      } else {
        calculateQuizRecommendation();
      }
    });
  }

  if (quizPrevBtn) {
    quizPrevBtn.addEventListener('click', () => {
      if (state.currentQuizStep > 1) {
        state.currentQuizStep--;
        updateQuizStepUI();
      }
    });
  }

  if (restartQuizBtn) {
    restartQuizBtn.addEventListener('click', () => {
      state.currentQuizStep = 1;
      state.quizAnswers = { useCase: null, dealbreaker: null, budget: null };
      quizOptionCards.forEach(c => c.classList.remove('selected'));
      if (quizResultsView) quizResultsView.classList.remove('active');
      const stepContainer = document.querySelector('.quiz-step-container');
      if (stepContainer) stepContainer.style.display = 'block';
      updateQuizStepUI();
    });
  }

  function updateQuizStepUI() {
    quizSteps.forEach(s => {
      if (parseInt(s.dataset.step) === state.currentQuizStep) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });

    quizStepIndicators.forEach((ind, idx) => {
      if (idx + 1 === state.currentQuizStep) {
        ind.classList.add('current');
      } else {
        ind.classList.remove('current');
      }
    });

    if (quizPrevBtn) {
      quizPrevBtn.style.visibility = state.currentQuizStep > 1 ? 'visible' : 'hidden';
    }

    if (quizNextBtn) {
      quizNextBtn.textContent = state.currentQuizStep === 3 ? 'Match Daily Driver' : 'Next Step →';
      let hasAnswer = false;
      if (state.currentQuizStep === 1 && state.quizAnswers.useCase) hasAnswer = true;
      if (state.currentQuizStep === 2 && state.quizAnswers.dealbreaker) hasAnswer = true;
      if (state.currentQuizStep === 3 && state.quizAnswers.budget) hasAnswer = true;
      quizNextBtn.disabled = !hasAnswer;
    }
  }

  function calculateQuizRecommendation() {
    const { useCase, dealbreaker, budget } = state.quizAnswers;

    const scored = PHONES.map(phone => {
      let score = 0;
      let reasons = [];
      let tradeoffs = [];

      // Budget scoring
      if (budget === 'budget') {
        if (phone.price <= 30000) {
          score += 35;
          reasons.push('Fits comfortably within your sub-₹30,000 budget ceiling.');
        } else if (phone.price <= 35000) {
          score += 15;
          tradeoffs.push(`Slightly stretches budget parameter at ${phone.priceFormatted}`);
        } else {
          score -= 20;
          tradeoffs.push(`Higher price bracket (${phone.priceFormatted})`);
        }
      } else if (budget === 'midrange') {
        if (phone.price >= 25000 && phone.price <= 60000) {
          score += 35;
          reasons.push('Ideal price-to-performance sweet spot (₹30K - ₹60K bracket).');
        } else if (phone.price < 25000) {
          score += 20;
          reasons.push('Under budget while offering flagship-level essentials.');
        } else {
          score += 10;
          tradeoffs.push(`Premium tier price at ${phone.priceFormatted}`);
        }
      } else if (budget === 'flagship') {
        if (phone.price >= 55000) {
          score += 35;
          reasons.push('Premium no-compromise flagship tier construction.');
        } else {
          score += 20;
          reasons.push('Delivers flagship performance at a lower expenditure tier.');
        }
      }

      // Dealbreaker scoring
      if (dealbreaker === 'flat-screen') {
        if (phone.isFlat) {
          score += 30;
          reasons.push('100% Flat display with zero curved glare or palm touches.');
        } else {
          score -= 40;
          tradeoffs.push('Features curved display edges (more glare, fragile drops)');
        }
      } else if (dealbreaker === '35mm-jack') {
        if (phone.hasJack) {
          score += 50;
          reasons.push('Features dedicated physical 3.5mm analog audio headphone jack.');
        } else {
          score -= 30;
          tradeoffs.push('Lacks 3.5mm headphone jack (requires Type-C or Bluetooth)');
        }
      } else if (dealbreaker === 'clean-os') {
        if (phone.isCleanOS) {
          score += 35;
          reasons.push('Bloatware-free, ad-free clean operating system.');
        } else {
          score -= 15;
          tradeoffs.push(`OS contains moderate preloaded vendor apps (${phone.os.bloatware})`);
        }
      } else if (dealbreaker === 'ois') {
        if (phone.hasOIS) {
          score += 30;
          reasons.push('Equipped with hardware Optical Image Stabilization (OIS).');
        } else {
          score -= 35;
          tradeoffs.push('Relies on electronic EIS only (lacks physical gyro OIS)');
        }
      }

      // Use Case scoring
      if (useCase === 'gaming') {
        if (phone.antutu >= 1500000) {
          score += 35;
          reasons.push(`Top-tier AnTuTu benchmark (${phone.antutuFormatted}) for competitive framerates.`);
        } else if (phone.antutu >= 1000000) {
          score += 25;
          reasons.push(`Fluent computational horsepower (~${phone.antutuFormatted} AnTuTu).`);
        } else {
          tradeoffs.push('Mid-tier silicon not tailored for sustained high-res 3D titles');
        }
      } else if (useCase === 'camera') {
        if (phone.hasOIS && (phone.brand === 'Google' || phone.brand === 'Samsung' || phone.brand === 'Apple' || phone.brand === 'Xiaomi' || phone.brand === 'Vivo')) {
          score += 35;
          reasons.push(`Class-leading ${phone.camera.main} optics with natural dynamic range.`);
        } else if (phone.hasOIS) {
          score += 25;
          reasons.push(`Reliable optical stabilization on primary ${phone.camera.main} sensor.`);
        } else {
          tradeoffs.push('Camera setup is basic with no optical stabilization');
        }
      } else if (useCase === 'battery') {
        if ((phone.battery.capacityNum || 0) >= 5500) {
          score += 35;
          reasons.push(`Massive ${phone.battery.capacity} battery cell with ${phone.battery.charging}.`);
        } else if ((phone.battery.capacityNum || 0) >= 5000) {
          score += 30;
          reasons.push(`High-density ${phone.battery.capacity} endurance for multi-day reliability.`);
        } else {
          tradeoffs.push(`Moderate battery capacity (${phone.battery.capacity})`);
        }
      } else if (useCase === 'productivity') {
        if (phone.isCleanOS && (phone.isCompact || phone.isFlat)) {
          score += 35;
          reasons.push('Calm, distraction-free software paired with ergonomic build.');
        } else if (phone.isCleanOS) {
          score += 25;
          reasons.push('Zero notification spam and clean stock system architecture.');
        } else {
          tradeoffs.push('Vendor UI requires notification hygiene to eliminate spam');
        }
      }

      // Add general trade-offs if not already added
      if (parseInt(phone.weight) > 215 && !tradeoffs.some(t => t.includes('weight'))) {
        tradeoffs.push(`Heavier chassis weight (${phone.weight})`);
      }
      if (!phone.hasJack && dealbreaker !== '35mm-jack') {
        tradeoffs.push('No 3.5mm headphone jack');
      }

      return { phone, score, reasons, tradeoffs };
    }).sort((a, b) => b.score - a.score);

    // Pick Top 3 Distinct Recommendations:
    // 1. Absolute top score
    const topPick = scored[0];
    
    // 2. Strong Alternative (different brand or archetype)
    const alternative = scored.slice(1).find(item => item.phone.brand !== topPick.phone.brand) || scored[1];
    
    // 3. Value / Budget Contender
    const valueContender = scored.slice(1).find(item => 
      item.phone.id !== topPick.phone.id && 
      item.phone.id !== alternative.phone.id && 
      item.phone.price < Math.max(topPick.phone.price, alternative.phone.price)
    ) || scored[2];

    const recommendations = [
      { item: topPick, badge: 'MATCH // BEST OVERALL PICK', matchPct: 98, isTop: true },
      { item: alternative, badge: 'MATCH // STRONG ALTERNATIVE', matchPct: 89, isTop: false },
      { item: valueContender, badge: 'MATCH // VALUE CONTENDER', matchPct: 82, isTop: false }
    ];

    if (quizResultsView) {
      const stepContainer = document.querySelector('.quiz-step-container');
      if (stepContainer) stepContainer.style.display = 'none';
      quizResultsView.classList.add('active');

      const resultSlot = document.getElementById('quiz-result-slot');
      if (resultSlot) {
        resultSlot.innerHTML = `
          <div class="quiz-recommendations-header">
            <div>
              <div class="eyebrow">Algorithmic Technical Match // Complete Report</div>
              <h2 style="font-family: var(--font-serif); font-size: 2rem; color: var(--text-primary); margin-top: 0.25rem;">Top 3 Recommended Smartphones</h2>
              <p style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem;">Evaluated against your workflow priorities, hardware non-negotiables, and budget boundary.</p>
            </div>
            <button class="btn btn-primary" id="compare-all-recs-btn" style="white-space: nowrap;">
              Compare All 3 Side-by-Side →
            </button>
          </div>

          <div class="quiz-recommendations-grid">
            ${recommendations.map(({ item, badge, matchPct, isTop }) => `
              <div class="quiz-rec-card ${isTop ? 'top-pick' : ''}">
                <div>
                  <div class="quiz-rec-tier-badge">${badge} · ${matchPct}%</div>
                  <div class="eyebrow" style="font-size: 0.65rem;">${item.phone.brand} · ${item.phone.categoryName}</div>
                  <h3 class="quiz-rec-name">${item.phone.name}</h3>
                  <div class="quiz-rec-price">${item.phone.priceFormatted || ('₹' + Number(item.phone.price).toLocaleString('en-IN'))}</div>

                  <div class="quiz-rec-reasons">
                    <strong style="color:var(--text-primary); font-size:0.75rem;">Why it matches:</strong>
                    <ul>
                      ${item.reasons.slice(0, 3).map(r => `<li>${r}</li>`).join('')}
                    </ul>
                  </div>

                  <div class="quiz-rec-tradeoffs">
                    <strong>Honest Trade-offs:</strong>
                    <span>${item.tradeoffs.slice(0, 2).join(' · ') || 'No notable hardware shortcomings in this bracket.'}</span>
                  </div>
                </div>

                <div class="quiz-rec-actions">
                  <button class="btn btn-outline btn-sm rec-inspect-btn" data-rec-id="${item.phone.id}">
                    Specs
                  </button>
                  <button class="btn btn-primary btn-sm rec-compare-btn" data-rec-id="${item.phone.id}">
                    + Compare
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `;

        // Event: Compare All 3 Recommendations Side-by-Side
        const compareAllBtn = document.getElementById('compare-all-recs-btn');
        if (compareAllBtn) {
          compareAllBtn.addEventListener('click', () => {
            state.comparisonList = recommendations.map(r => r.item.phone);
            updateCompareDrawerUI();
            renderPhoneCards();
            openFullCompareModal();
          });
        }

        // Event: Inspect individual recommendation
        resultSlot.querySelectorAll('.rec-inspect-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const phone = PHONES.find(p => p.id === btn.dataset.recId);
            if (phone) openPhoneSpecWindow(phone.id);
          });
        });

        // Event: Add individual recommendation to tray
        resultSlot.querySelectorAll('.rec-compare-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const phone = PHONES.find(p => p.id === btn.dataset.recId);
            if (!phone) return;
            if (state.comparisonList.length >= 3 && !state.comparisonList.some(p => p.id === phone.id)) {
              showToast('Comparison tray limit reached (3 max).');
              return;
            }
            if (!state.comparisonList.some(p => p.id === phone.id)) {
              state.comparisonList.push(phone);
              updateCompareDrawerUI();
              renderPhoneCards();
              showToast(`Added ${phone.name} to comparison tray.`);
            } else {
              showToast(`${phone.name} is already in comparison tray.`);
            }
          });
        });
      }
    }
  }

  // ==========================================================================
  // 14. INITIAL DATA LOADING & BOOTSTRAP
  // ==========================================================================
  async function loadPhonesData() {
    try {
      // Query verified phones through the data access layer
      const res = await getPhones({ category: 'all' });
      PHONES = res.data || [];

      await renderPhoneCards();
      updateCompareDrawerUI();
      populateDeckSelects();
      renderHeroMatchup('samsung-galaxy-s24-ultra', 'iphone-15-pro-max');
      initHeroMatchupListeners();
      initDeckEventListeners();

      // Check URL for shareable comparison parameter (?compare=id1,id2)
      checkURLForComparison();
    } catch (err) {
      console.error('[RE-CONE] Initialization error:', err);
      if (phonesGrid) {
        phonesGrid.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 4rem 2rem; text-align: center; border: 1px solid var(--border-dark); background-color: var(--bg-card);">
            <div class="eyebrow" style="color: #ff5555; margin-bottom: 0.5rem;">CONNECTION NOTICE</div>
            <h3 style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--text-primary); margin-bottom: 0.5rem;">Failed to load verified database</h3>
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1.25rem;">${err.message || 'Error communicating with Supabase backend.'}</p>
            <button class="btn btn-primary btn-sm" id="initial-retry-btn">↻ Retry Connection</button>
          </div>
        `;
        const rBtn = document.getElementById('initial-retry-btn');
        if (rBtn) rBtn.addEventListener('click', () => loadPhonesData());
      }
    }
  }

  loadPhonesData();

  // ==========================================================================
  // 15. MOBILE MENU TOGGLE
  // ==========================================================================
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobilePanel = document.querySelector('.mobile-nav-panel');
  if (mobileToggle && mobilePanel) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobilePanel.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mobilePanel.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobilePanel.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
});
