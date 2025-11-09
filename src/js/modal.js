import { getInstrumentData } from './ui.js';

export function initializeModal() {
    const dialog = document.getElementById('instrument-dialog');
    const instrumentsList = document.getElementById('instruments-list');

    if (!dialog || !instrumentsList) {
        console.error("Modal or instrument list not found.");
        return;
    }

    instrumentsList.addEventListener('click', (event) => {
        const card = event.target.closest('.instrument-card');
        if (card) {
            const index = card.dataset.instrumentIndex;
            const data = getInstrumentData(index);

            if (data) {
                // Populate and show the modal
                document.getElementById('dialog-title').textContent = data.title;
                const dialogImage = document.getElementById('dialog-image');
                dialogImage.src = data.imageUrl;
                dialogImage.alt = data.title;
                document.getElementById('dialog-desc').textContent = data.extract;
                
                dialog.showModal();
            }
        }
    });

    // The form element should handle the close button automatically.
    const closeButton = dialog.querySelector('.dialog-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            dialog.close();
        });
    }

    // Also close when clicking on the backdrop
    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });
}