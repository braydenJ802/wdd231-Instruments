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

    // Woodwinds first, so "basset horn" is not mis-tagged as brass
    const woodwindKeywords = [
        "flute",           // covers alto flute, western concert flute
        "clarinet",        // covers bass/contra/E-flat clarinets
        "basset horn",     // specific woodwind containing "horn"
        "oboe",            // covers oboe and oboe d'amore
        "cor anglais",     // English horn (alt name)
        "english horn",    // English horn (explicit)
        "bassoon",         // bassoon
        "saxophone",       // saxophone family
        "heckelphone",     // double reed
        "sarrusophone"     // double reed family
    ];
    const isWoodwind = woodwindKeywords.some(k => name.includes(k))
        || (name.includes("piccolo") && !name.includes("trumpet")); // avoid mis-tagging "piccolo trumpet"
    if (isWoodwind) return "woodwind";

    // Brass
    if ([
        "trumpet",     // covers keyed/piccolo trumpet
        "trombone",    // includes valve trombone
        "tuba",        // includes wagner tuba
        "horn",        // covers french/german/vienna/natural horn (woodwind "basset horn" handled above)
        "euphonium",
        "cornet",
        "flugelhorn",
        "cimbasso",
        "ophicleide",
        "serpent"
    ].some(k => name.includes(k)))
        return "brass";

    // Percussion
    if ([
        "timpani",
        "snare drum",
        "bass drum",
        "cymbals"
    ].some(k => name.includes(k)))
        return "percussion";

    // Keyboards and related (classified as other)
    if ([
        "harpsichord",
        "piano",
        "fortepiano",
        "pipe organ",
        "organ",
        "celesta"
    ].some(k => name.includes(k)))
        return "other";

    // Strings (including additional plucked/continuo instruments)
    if ([
        "violin",
        "viola",
        "cello",
        "double bass",
        "harp",
        "guitar",
        "lute",
        "mandolin",
        "theorbo",
        "colascione"
    ].some(k => name.includes(k)))
        return "strings";

    return "other";
}

function addInstrumentFamilies(instruments) {
    return instruments.map(instrument => ({
        ...instrument,
        family: tagInstrument(instrument),
    }));
}
