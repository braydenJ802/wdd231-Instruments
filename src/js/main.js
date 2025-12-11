import { fetchInstruments } from './api.js';
import * as ui from './ui.js';
import { getUser, saveUser } from './storage.js';
import { initializeModal } from './modal.js';

const signupBtn = document.getElementById('signup-btn');
const params = new URLSearchParams(window.location.search);
const nameFromURL = params.get('name');

let userData = getUser();

if (nameFromURL && (!userData || userData.name !== nameFromURL)) {
  userData = { name: nameFromURL };
  saveUser(userData);
}

if (userData && userData.name) {
  signupBtn.textContent = `Hi ${userData.name}, thanks for signing up for our email service!`;
} else {
  signupBtn.addEventListener('click', () => {
    window.location.href = 'signup.html';
  });
}

window.allInstruments = []; // global array to store instruments
let allInstruments = [];

document.addEventListener('DOMContentLoaded', async () => {
  const searchInput = document.getElementById('instrument-search');
  const favoriteFilterButton = document.querySelector('.favorite-filter');
  const familyFilterSelect = document.getElementById('instrument-family-filter');

  // Local filter state
  let currentQuery = '';
  let currentFamily = 'all'; // one of: all, brass, woodwind, percussion, strings, other

  try {
    // Fetch instruments
    window.allInstruments = await fetchInstruments();
    allInstruments = window.allInstruments;

    // Initial render
    await ui.renderInstruments(allInstruments);
    initializeModal();

    // Search input
    if (searchInput) {
      searchInput.addEventListener('input', async (e) => {
        currentQuery = e.target.value.toLowerCase();
        const filtered = applyFilters(allInstruments, currentQuery, currentFamily);
        await ui.renderInstruments(maybeApplyFavorites(filtered, favoriteFilterButton));
        initializeModal();
      });
    }

    // Favorites filter button
    if (favoriteFilterButton) {
      favoriteFilterButton.addEventListener('click', async () => {
        const wasPressed = favoriteFilterButton.getAttribute('aria-pressed') === 'true';
        const isNowPressed = !wasPressed;
        favoriteFilterButton.setAttribute('aria-pressed', String(isNowPressed));

        // Update favorites state in UI module and re-render with current filters
        const filtered = applyFilters(allInstruments, currentQuery, currentFamily);
        await ui.setFavoritesFilter(isNowPressed, filtered);
        initializeModal();
      });
    }

    // Instrument family dropdown
    if (familyFilterSelect) {
      familyFilterSelect.addEventListener('change', async () => {
        const selected = normalizeFamilyValue(familyFilterSelect.value);
        currentFamily = selected || 'all';

        const filtered = applyFilters(allInstruments, currentQuery, currentFamily);
        await ui.renderInstruments(maybeApplyFavorites(filtered, favoriteFilterButton));
        initializeModal();
      });
    }

  } catch (err) {
    console.error("Failed to fetch or render instruments:", err);
  }
});

// Helper: apply search and family filters (favorites handled by UI module)
function applyFilters(instruments, query, family) {
  let result = instruments;
  if (query && query.trim() !== '') {
    const q = query.toLowerCase();
    result = result.filter(inst => inst.title.toLowerCase().includes(q));
  }
  const fam = (family || 'all').toLowerCase();
  if (fam !== 'all') {
    result = result.filter(inst => (inst.family || 'other').toLowerCase() === fam);
  }
  return result;
}

// Helper: map dropdown value to our tag
function normalizeFamilyValue(value) {
  const v = (value || '').toLowerCase();
  if (v.includes('all')) return 'all';
  const map = {
    'brass': 'brass',
    'woodwinds': 'woodwind',
    'woodwind': 'woodwind',
    'percussion': 'percussion',
    'strings': 'strings',
    'other': 'other',
  };
  return map[v] || 'all';
}

// Helper: apply favorites filter based on button state
function maybeApplyFavorites(list, favoriteFilterButton) {
  const isFavOn = favoriteFilterButton && favoriteFilterButton.getAttribute('aria-pressed') === 'true';
  return isFavOn ? list.filter(inst => inst.favorite) : list;
}
