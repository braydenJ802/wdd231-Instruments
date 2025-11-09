let instrumentsData = []; // Module-level variable to store data

export async function renderInstruments(instruments) {
    const instrumentsList = document.getElementById("instruments-list");
    if (!instrumentsList) {
        console.error("Could not find instruments-list element");
        return;
    }

    const filteredInstruments = instruments.filter(inst => {
        return inst.ns === 0 && inst.title !== 'Treatise on Instrumentation';
    });
    instrumentsData = []; // Reset data array

    const instrumentPromises = filteredInstruments.map(async (instrument) => {
        try {
            const title = instrument.title;
            
            const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
            const summaryResponse = await fetch(summaryUrl);
            if (!summaryResponse.ok) {
                throw new Error(`Failed to fetch summary for ${title}`);
            }
            const summaryData = await summaryResponse.json();
            
            const imageUrl = summaryData.thumbnail ? summaryData.thumbnail.source : null;

            // Only display the instrument if an image is available.
            if (!imageUrl) {
                return '';
            }

            // Store all relevant data for the modal
            const instrumentDetails = {
                title: title,
                imageUrl: imageUrl,
                extract: summaryData.extract,
            };
            const index = instrumentsData.push(instrumentDetails) - 1;

            // Generate HTML for the grid (image and name only)
            let html = `<li class="instrument-card" data-instrument-index="${index}" role="button" tabindex="0">
                            <figure>
                                <img src="${imageUrl}" alt="${title}">
                                <figcaption>${title}</figcaption>
                            </figure>
                        </li>`;
            return html;
        } catch (error) {
            console.error(`Failed to process instrument ${instrument.title}:`, error);
            return ''; // Return an empty string for this instrument to not break the page
        }
    });

    const instrumentHtmls = await Promise.all(instrumentPromises);
    instrumentsList.innerHTML = instrumentHtmls.join('');
}

// Helps to get data for the modal
export function getInstrumentData(index) {
    return instrumentsData[index];
}