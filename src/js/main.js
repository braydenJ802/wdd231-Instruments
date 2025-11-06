import { fetchInstruments } from './api.js';
import { renderInstruments } from './ui.js';
import { loadFromStorage } from './storage.js';

fetchInstruments().then(data => {
  renderInstruments(data);
  loadFromStorage();
});
