import { fetchInstruments } from './api.js';
import { renderInstruments } from './ui.js';
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

let allInstruments = [];

document.addEventListener('DOMContentLoaded', async () => {
  const searchInput = document.getElementById('instrument-search');
  if (!searchInput) {
    console.error("Search input not found! Make sure your HTML has <input id='instrument-search'>");
  }

  try {
    allInstruments = await fetchInstruments();

    // Initial render
    await renderInstruments(allInstruments);
    initializeModal();

    if (searchInput) {
      searchInput.addEventListener('input', async (e) => {
        const query = e.target.value.toLowerCase();
        console.log("Search input changed:", query);

        // Filter raw API data by title only
        const filtered = allInstruments.filter(inst => {
          return inst.title.toLowerCase().includes(query);
        });

        await renderInstruments(filtered);
        initializeModal();
      });
    }

  } catch (err) {
    console.error("Failed to fetch or render instruments:", err);
  }
});
