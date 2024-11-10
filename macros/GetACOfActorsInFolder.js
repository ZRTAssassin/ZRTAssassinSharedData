const folderName = 'PCs'

const folder = game.folders.getName(folderName);
if (!folder) {
    ui.notifications.error(`Folder "${folderName}" not found.`);
    return;
}

const actors = folder.contents.filter(item => item.documentName === "Actor");
if (!actors.length) {
    ui.notifications.warn("No actors found in folder.");
    return;
}

let chatContent = ''
for (const actor of actors) {
    var ac = actor.getRollData().attributes.ac.value;
    var actorName = actor.getRollData().name;

    console.log(`Name: ${actorName}, AC: ${ac}`)
}
