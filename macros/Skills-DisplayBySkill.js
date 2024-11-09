const folderName = "Folder"
const folder = game.folders.getName(folderName);
// const actorId = 'XgTdub1HjWTPiNdD';
// let controlledActor = game.actors.get(actorId);
// console.log(controlledActor);
if (folder) {
    const skillNames = {
        acr: "Acrobatics",
        ani: "Animal Handling",
        arc: "Arcana",
        ath: "Athletics",
        dec: "Deception",
        his: "History",
        ins: "Insight",
        itm: "Intimidation",
        inv: "Investigation",
        med: "Medicine",
        nat: "Nature",
        prc: "Perception",
        prf: "Performance",
        per: "Persuasion",
        rel: "Religion",
        slt: "Sleight of Hand",
        ste: "Stealth",
        sur: "Survival"
    };

    // Initialize objects to store which actors have which proficiencies
    const skillMap = {
        acr: [], ani: [], arc: [], ath: [], dec: [], 
        his: [], ins: [], itm: [], inv: [], med: [],
        nat: [], prc: [], prf: [], per: [], rel: [],
        slt: [], ste: [], sur: []
    };
    const toolMap = {};
   
    folder.contents.forEach(actor => {
        // Add actor name to each skill they're proficient in
        Object.entries(actor.system.skills)
            .filter(([_, skill]) => skill.proficient === 1)
            .forEach(([skillName, _]) => {
                skillMap[skillName].push(actor.name);
            });
            
        // Add actor name to each tool they're proficient in
        Object.entries(actor.system.tools)
            .filter(([_, tool]) => tool.value === 1)
            .forEach(([toolName, _]) => {
                if (!toolMap[toolName]) toolMap[toolName] = [];
                toolMap[toolName].push(actor.name);
            });
    });

    let chatContent = '<div class="proficiency-summary">';
    
    // Add Skills section
    chatContent += '<h2>Skills:</h2>';
    Object.entries(skillMap).forEach(([skill, actors]) => {
        const skillName = skillNames[skill];
        chatContent += `<p><strong>${skillName}:</strong> ${actors.length ? actors.join(', ') : '-'}</p>`;
    });
    
    // Add Tools section only if there are any tool proficiencies
    if (Object.keys(toolMap).length > 0) {
        chatContent += '<h2>Tools:</h2>';
        Object.entries(toolMap).forEach(([tool, actors]) => {
            const toolName = tool.charAt(0).toUpperCase() + tool.slice(1);
            chatContent += `<p><strong>${toolName}:</strong> ${actors.join(', ')}</p>`;
        });
    }
    
    chatContent += '</div>';
    
    ChatMessage.create({
        content: chatContent,
        whisper: [game.user.id]
    });
}