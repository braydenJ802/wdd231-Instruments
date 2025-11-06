async function getOrchestralInstrumentsWithMedia() {
    const instrumentsList = document.getElementById("instruments-list");
    const categoryUrl = "https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Orchestral_instruments&cmlimit=500&format=json&origin=*";
    const categoryResponse = await fetch(categoryUrl);
    const categoryData = await categoryResponse.json();
    const instruments = categoryData.query.categorymembers;
    
    for (const instrument of instruments) {
        const title = instrument.title;
        
        // Use REST API for summary and image
        const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
        const summaryResponse = await fetch(summaryUrl);
        console.log(summaryResponse);
        const summaryData = await summaryResponse.json();
        console.log(summaryData);
        
        // Use REST API for media links
        const mediaUrl = `https://en.wikipedia.org/api/rest_v1/page/${encodeURIComponent(title)}/links/media`;
        const mediaResponse = await fetch(mediaUrl);

        // Check if mediaResponse is ok before parsing JSON
        let mediaData = null;
        if (mediaResponse.ok) {
            mediaData = await mediaResponse.json();
        } else {
            console.log(`No media found for ${title}. Status: ${mediaResponse.status}`);
        }
        
        // 
        let imageUrl = summaryData.thumbnail ? summaryData.thumbnail.source : null;
        let audioUrl = null;
        
        // Find an audio file only if mediaData is not null
        if (mediaData && mediaData.files) {
            for (const item of mediaData.files) {
                if (item.type === 'audio') {
                    const fileTitle = item.title;
                    const fileUrl = `https://api.wikimedia.org/core/v1/commons/file/${encodeURIComponent(fileTitle)}`;
                    const fileResponse = await fetch(fileUrl);
                    const fileData = await fileResponse.json();
                    audioUrl = fileData.preferred.url;
                    break;
                }
            }
        }
        
        // Display the results
        const li = document.createElement('li');
        let html = `<h3>${title}</h3>`;
        if (imageUrl) {
            html += `<img src="${imageUrl}" alt="${title}">`;
        }
        if (summaryData.extract) {
            html += `<p>${summaryData.extract}</p>`;
        }
        if (audioUrl) {
            html += `<audio controls><source src="${audioUrl}" type="audio/ogg"></audio>`;
        }
        li.innerHTML = html;
        instrumentsList.appendChild(li);
    }
}

getOrchestralInstrumentsWithMedia();