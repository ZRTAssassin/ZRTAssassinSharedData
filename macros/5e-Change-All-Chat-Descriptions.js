//we want to change the chat description of every action of every actor to the name of the action itself
//well, what we want to do now is put a secret block around it actually...

let folderNamesToSearch = [
    "Challenges",
    "For Later",
    "Hunting Targets",
    "Lizardfolk",
    // "ToAddMore",
    // "JustDoThis"
];
let numActions = 0;
for (let i = 0; i < folderNamesToSearch.length; i++) {
    const folder = folderNamesToSearch[i];
    UpdateChatDescriptions(folder)
}

// Function to update HP for wild shape forms
async function UpdateChatDescriptions(folderName) {
    // Get the folder containing the beast forms
    const folder = game.folders.getName(folderName);

    if (!folder) {
        ui.notifications.error(`Folder "${folderName}" not found.`);
        return;
    }

    console.log(folder);
    let childActors = folder.contents.filter(x => x.documentName === "Actor");
    console.log('childActors', childActors);

    for (const actor of childActors) {

        const actionItems = actor.items.filter(x => ['weapon', 'feat', 'spell'].includes(x.type));
        console.log('actionItems', actionItems);

        for (const item of actionItems) {
            console.log(`Action before update:`, item.system.description.chat);

            let secretStart = `
            <div class="rd__b  rd__b--3">
                <section class="secret" id="secret-sB9fQnloubPr15Qk">
                    ${item.system.description.value}
                </section>
            </div>`;
            //console.log(secretStart);

            // Update the chat description
            await item.update({
                "system.description.chat": secretStart
            });
            // await item.update({
            //     "system.description.chat": `<p>${item.name}</p>`
            // });
            numActions++;
            console.log(`Action after update:`, item.system.description.chat, 'numActions', numActions);
        }
    }
}
