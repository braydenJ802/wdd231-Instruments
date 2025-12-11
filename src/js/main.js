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
        const query = e.target.value.toLowerCase();

        let filtered = allInstruments.filter(inst =>
          inst.title.toLowerCase().includes(query)
        );

        // Apply favorites filter if active
        const instrumentsToRender = favoriteFilterButton.getAttribute('aria-pressed') === 'true'
          ? filtered.filter(inst => inst.favorite)
          : filtered;

        await ui.renderInstruments(instrumentsToRender);
        initializeModal();
      });
    }

    // Favorites filter button
    if (favoriteFilterButton) {
      favoriteFilterButton.addEventListener('click', async () => {
        const wasPressed = favoriteFilterButton.getAttribute('aria-pressed') === 'true';
        const isNowPressed = !wasPressed;
        favoriteFilterButton.setAttribute('aria-pressed', String(isNowPressed));

        // Re-render using full instruments array
        await ui.setFavoritesFilter(isNowPressed, allInstruments);

        // Re-apply search filter if any
        if (searchInput && searchInput.value.trim() !== '') {
          const query = searchInput.value.toLowerCase();
          let filtered = allInstruments.filter(inst =>
            inst.title.toLowerCase().includes(query)
          );

          const instrumentsToRender = isNowPressed
            ? filtered.filter(inst => inst.favorite)
            : filtered;

          await ui.renderInstruments(instrumentsToRender);
          initializeModal();
        }
      });
    }

  } catch (err) {
    console.error("Failed to fetch or render instruments:", err);
  }
});
