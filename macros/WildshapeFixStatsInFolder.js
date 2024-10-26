// Function to update HP for wild shape forms
async function UpdateChatDescriptions(folderName, druidActorId) {
    // Get the folder containing the beast forms
    const folder = game.folders.getName(folderName);
    if (!folder) {
        ui.notifications.error(`Folder "${folderName}" not found.`);
        return;
    }
    
    // Get the druid actor
    const druidActor = game.actors.get(druidActorId);
    if (!druidActor) {
        ui.notifications.error(`Druid actor with ID "${druidActorId}" not found.`);
        return;
    }
    console.log(`folder contents`, folder.contents, `druid actor`, druidActor);
    
    // Get the druid's HP and level
    const druidMaxHP = druidActor.system.attributes.hp.max;
    const druidCurrentHP = druidActor.system.attributes.hp.value;
    const druidLevel = druidActor.classes.druid.system.levels;
    if (druidLevel === 0) {
        ui.notifications.warn("Druid level is 0 or not found.");
        return;
    }

    // Get all actors in the folder
    const beastActors = folder.contents.filter(item => item.documentName === "Actor");
    console.log(`beasts:${beastActors}`);

    // Update each beast actor
    for (let beastActor of beastActors) {
        const isSpecificActor = beastActor.id === "wAYnV5GBaZeMcR62"; // Replace with your specific actor ID
        const multiplier = isSpecificActor ? 4 : 3;
        const newHP = multiplier * druidLevel;

        await beastActor.update({
            "system.attributes.hp.max": druidMaxHP,
            "system.attributes.hp.value": druidCurrentHP,
            "system.attributes.hp.temp": newHP
        });

        console.log(`Updated ${beastActor.name}: HP set to ${newHP}`);
    }

    ui.notifications.info(`Updated HP for ${beastActors.length} beast forms.`);
}

UpdateChatDescriptions('Arbiter Wildshapes', '9nE8krcM2NSRG6Ui');


