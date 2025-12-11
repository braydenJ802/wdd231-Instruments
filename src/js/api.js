export async function fetchInstruments() {
    const categoryUrl = "https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Orchestral_instruments&cmlimit=500&format=json&origin=*";
    const categoryResponse = await fetch(categoryUrl);
    console.log(categoryResponse);
    const categoryData = await categoryResponse.json();
    console.log(categoryData);
    const instruments = categoryData.query.categorymembers;
    console.log(instruments);

    const taggedInstruments = addInstrumentFamilies(instruments);
    console.log(taggedInstruments);

    return taggedInstruments;
}


function tagInstrument({ title }) {
    const name = title.toLowerCase();

    if (["flute", "clarinet", "oboe", "bassoon"].some(k => name.includes(k)))
        return "woodwind";

    if (["trumpet", "trombone", "tuba", "french horn", "euphonium"].some(k => name.includes(k)))
        return "brass";

    if (["timpani", "snare drum", "bass drum", "cymbals"].some(k => name.includes(k)))
        return "percussion";

    if (["violin", "viola", "cello", "double bass", "harp"].some(k => name.includes(k)))
        return "strings";

    return "other";
}

function addInstrumentFamilies(instruments) {
    return instruments.map(instrument => ({
        ...instrument,
        family: tagInstrument(instrument),
    }));
}
