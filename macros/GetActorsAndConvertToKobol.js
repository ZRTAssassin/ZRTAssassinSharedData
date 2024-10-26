// Foundry VTT Macro: Convert Actor to Kobold+ JSON format, enrich with compendium data, and save to Journal

const actorId = "Compendium.world.world-compendium.Actor.7a3v9BxDIQkW5nI3";
const journalId = "1UEASSiapCjddWg6";
const compendiumId = "world.world-compendium";


function getCRString(cr) {
    if (cr === 0.25) return "1/4";
    if (cr === 0.5) return "1/2";
    return cr.toString();
}

function getSizeString(size) {
    const sizeMap = {
        "tiny": "Tiny",
        "sm": "Small",
        "med": "Medium",
        "lg": "Large",
        "huge": "Huge",
        "grg": "Gargantuan"
    };
    return sizeMap[size] || "Medium";
}

async function getAllCompendiumData() {
    const pack = game.packs.get(compendiumId);
    if (!pack) {
        ui.notifications.error(`Compendium ${compendiumId} not found.`);
        return [];
    }

    const index = await pack.getIndex();
    const monsters = await Promise.all(index.map(entry => pack.getDocument(entry._id)));
    return monsters;
}

function convertMonsterToKoboldFormat(monster) {
    return {
        "name": monster.name,
        "cr": getCRString(monster.system.details.cr),
        "size": getSizeString(monster.system.traits.size),
        "type": monster.system.details.type.value,
        "tags": monster.system.details.type.subtype || "",
        "section": "Imported Monsters",
        "alignment": monster.system.details.alignment,
        "environment": monster.system.details.environment || "unknown",
        "ac": monster.system.attributes.ac.value,
        "hp": monster.system.attributes.hp.max,
        "init": monster.system.attributes.init.total,
        "lair": monster.system.resources.lair ? "lair" : "",
        "legendary": monster.system.resources.legact ? "legendary" : "",
        "unique": monster.system.traits.unique ? "unique" : "",
        "sources": monster.system.details.source || "Unknown Source"
    };
}

async function updateJournalWithMonsterData(journalEntry, monstersData) {
    const content = `
        <h1>Imported Monster Data</h1>
        <pre>${JSON.stringify({monsters: monstersData}, null, 2)}</pre>
    `;
    
    await journalEntry.update({content: content});
}

// Main macro execution
getAllCompendiumData().then(monsters => {
    console.log(`Found ${monsters.length} monsters in the compendium.`);
    
    const monstersData = monsters.map(convertMonsterToKoboldFormat);
    
    const journalEntry = game.journal.get(journalId);
    if (!journalEntry) {
        ui.notifications.error(`Journal entry with ID ${journalId} not found.`);
        return;
    }
    
    updateJournalWithMonsterData(journalEntry, monstersData).then(() => {
        ui.notifications.info(`Successfully updated journal entry with data from ${monsters.length} monsters.`);
    });
});