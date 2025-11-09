import { fetchInstruments } from './api.js';
import { renderInstruments } from './ui.js';
import { initializeModal } from './modal.js';


document.addEventListener('DOMContentLoaded', () => {
    fetchInstruments().then(data => {
      // renderInstruments returns a promise, wait for it to resolve
      renderInstruments(data).then(() => {
        // Now that the grid is rendered, set up the modal listeners
        initializeModal();
      });
    });
});
