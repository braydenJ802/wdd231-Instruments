export async function fetchInstruments() {
    const instrumentsList = document.getElementById("instruments-list");
    const categoryUrl = "https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Orchestral_instruments&cmlimit=500&format=json&origin=*";
    const categoryResponse = await fetch(categoryUrl);
    console.log(categoryResponse);
    const categoryData = await categoryResponse.json();
    console.log(categoryData);
    const instruments = categoryData.query.categorymembers;
    console.log(instruments);
    
    return instruments;
}
