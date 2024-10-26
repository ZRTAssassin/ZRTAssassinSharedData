// Fetch the first actor from the "Import Folder"
const folderName = "Import Folder";

function getFirstActorFromFolder() {
    // Find the folder
    const folder = game.folders.find(f => f.name === folderName && f.type === "Actor");
    
    if (!folder) {
        console.error(`Folder "${folderName}" not found.`);
        return null;
    }
    
    console.log("Found folder:", folder);
    
    // Get the first actor in the folder
    const firstActor = folder.contents[0];
    
    if (!firstActor) {
        console.log("No actors found in the folder.");
        return null;
    }
    
    console.log("First actor in folder:", firstActor);
    return firstActor;
}

// Main execution
let actor = getFirstActorFromFolder();
console.log("Result:", actor);