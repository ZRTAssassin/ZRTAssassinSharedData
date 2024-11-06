const folderName = "Folder"
const folder = game.folders.getName(folderName);
// const actorId = 'XgTdub1HjWTPiNdD';
// let controlledActor = game.actors.get(actorId);
// console.log(controlledActor);
if (folder) {
    const actorProficiencies = {};
   
    folder.contents.forEach(actor => {
        actorProficiencies[actor.name] = {
            skills: Object.fromEntries(
                Object.entries(actor.system.skills)
                    .filter(([_, skill]) => skill.proficient === 1)
            ),
            tools: Object.fromEntries(
                Object.entries(actor.system.tools)
                    .filter(([_, tool]) => tool.value === 1)
            )
        };
    });

    let chatContent = '<div class="proficiency-summary">';
    
    Object.entries(actorProficiencies).forEach(([actorName, proficiencies]) => {
        chatContent += `<h3>${actorName}</h3>`;
        
        if (Object.keys(proficiencies.skills).length) {
            chatContent += '<p><strong>Skills:</strong> ';
            chatContent += Object.keys(proficiencies.skills)
                .map(skill => skill.charAt(0).toUpperCase() + skill.slice(1))
                .join(', ');
            chatContent += '</p>';
        } else {
            chatContent += '<p><strong>Skills:</strong> None</p>';
        }
        
        if (Object.keys(proficiencies.tools).length) {
            chatContent += '<p><strong>Tools:</strong> ';
            chatContent += Object.keys(proficiencies.tools)
                .map(tool => tool.charAt(0).toUpperCase() + tool.slice(1))
                .join(', ');
            chatContent += '</p>';
        } else {
            chatContent += '<p><strong>Tools:</strong> None</p>';
        }
        
        chatContent += '<hr>';
    });
    
    chatContent += '</div>';
    
    ChatMessage.create({
        content: chatContent,
        whisper: [game.user.id]
    });
    
    console.log(actorProficiencies);
}