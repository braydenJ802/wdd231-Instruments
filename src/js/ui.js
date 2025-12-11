let instrumentsData = [];
let favoritesOnly = false;

// Render instruments
export async function renderInstruments(instruments) {
    const instrumentsList = document.getElementById("instruments-list");
    if (!instrumentsList) return;

    const filtered = instruments.filter(inst => inst.ns === 0 && inst.title !== 'Treatise on Instrumentation');
    const instrumentsToRender = favoritesOnly
        ? filtered.filter(inst => inst.favorite)
        : filtered;

    instrumentsData = [];

    const instrumentPromises = instrumentsToRender.map(async (inst) => {
        try {
            if (typeof inst.favorite === 'undefined') inst.favorite = false;

            const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(inst.title)}`;
            const summaryResponse = await fetch(summaryUrl);
            if (!summaryResponse.ok) return '';

            const summaryData = await summaryResponse.json();
            const imageUrl = summaryData.thumbnail ? summaryData.thumbnail.source : null;
            if (!imageUrl) return '';

            const instrumentDetails = {
                title: inst.title,
                imageUrl,
                extract: summaryData.extract,
                favorite: inst.favorite
            };
            const index = instrumentsData.push(instrumentDetails) - 1;

            const heartClass = inst.favorite ? 'heart favorited' : 'heart';

            return `
                <li class="instrument-card" data-instrument-index="${index}" role="button" tabindex="0">
                    <div class="${heartClass}" data-index="${index}">♥</div>
                    <figure>
                        <img src="${imageUrl}" alt="${inst.title}">
                        <figcaption>${inst.title}</figcaption>
                    </figure>
                </li>
            `;
        } catch (err) {
            console.error(`Failed to process ${inst.title}:`, err);
            return '';
        }
    });

    const htmls = await Promise.all(instrumentPromises);
    instrumentsList.innerHTML = htmls.join('');

    // Attach click events to hearts
    document.querySelectorAll('.instrument-card .heart').forEach(heart => {
        heart.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = heart.getAttribute('data-index');

            // Toggle favorite in instrumentsData
            instrumentsData[idx].favorite = !instrumentsData[idx].favorite;

            // Toggle favorite in the original allInstruments array
            if (window.allInstruments) {
                const original = window.allInstruments.find(inst => inst.title === instrumentsData[idx].title);
                if (original) original.favorite = instrumentsData[idx].favorite;
            }

            heart.classList.toggle('favorited', instrumentsData[idx].favorite);
        });
    });
}

// Set favorites filter
export async function setFavoritesFilter(enabled, fullInstruments) {
    favoritesOnly = enabled;
    await renderInstruments(fullInstruments);
}

// Retrieve data for modal
export function getInstrumentData(index) {
    return instrumentsData[index];
}
