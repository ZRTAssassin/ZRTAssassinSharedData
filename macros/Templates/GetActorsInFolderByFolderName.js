const folderName = 'PCs'

const folder = game.folders.getName(folderName);
if (!folder) {
    ui.notifications.error(`Folder "${folderName}" not found.`);
    return;
}

