//todo update, and make sure AC applies

// Function to update HP for wild shape forms
async function UpdateWildShapeStats(folderName, druidActorId) {
    try {
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

        const druidStats = {
            maxHP: druidActor?.system?.attributes?.hp?.max ?? 0,
            currentHP: druidActor?.system?.attributes?.hp?.value ?? 0,
            level: druidActor?.classes?.druid?.system?.levels ?? 0,
            wisdomMod: druidActor?.system?.abilities?.wis?.mod ?? 0,
        };

        if (druidStats.maxHP <= 0) {
            ui.notifications.error("Invalid druid max HP.");
        }
        if (druidStats.currentHP < 0) {
            ui.notifications.error("Invalid druid current HP.");
        }
        if (druidStats.level <= 0) {
            ui.notifications.error("Invalid or missing druid level.");
        }

        const druidAC = 13 + druidStats.wisdomMod;

        // Get all actors in the folder
        const beastActors = folder.contents.filter(item => item.documentName === "Actor");
        if (!beastActors.length) {
            ui.notifications.error("No beast actors found in folder.");
            return;
        }

        let chatContent = `<h3>Wild Shape Stats Update</h3>`;
        chatContent += `<p>Druid Level: ${druidStats.level}</p>`;
        chatContent += `<p>Druid AC Base: ${druidAC} (13 + ${druidStats.wisdomMod} Wisdom)</p>`;
        chatContent += `<hr>`;

        // Update each beast actor
        for (let beastActor of beastActors) {
            const isSpecificActor = beastActor.id === "wAYnV5GBaZeMcR62"; // Replace with your specific actor ID
            const multiplier = isSpecificActor ? 4 : 3;
            const newHP = multiplier * druidStats.level;


            const originalStats = {
                maxHP: beastActor.system?.attributes?.hp?.max ?? 0,
                currentHP: beastActor.system?.attributes?.hp?.value ?? 0,
                tempHP: beastActor.system?.attributes?.hp?.temp ?? 0,
                AC: beastActor.system?.attributes?.ac?.value ?? 10
            };

            const newAC = Math.max(originalStats.AC, druidAC);

            await beastActor.update({
                "system.attributes.hp.max": druidStats.maxHP,
                "system.attributes.hp.value": druidStats.currentHP,
                "system.attributes.hp.temp": newHP,
                "system.attributes.ac.value": newAC
            });

            chatContent += `<div style="margin-bottom: 10px;">`;
            chatContent += `<strong>${beastActor.name}</strong><br>`;
            chatContent += `Max HP: ${originalStats.maxHP} → ${druidStats.maxHP}<br>`;
            chatContent += `Current HP: ${originalStats.currentHP} → ${druidStats.currentHP}<br>`;
            chatContent += `Temp HP: ${originalStats.tempHP} → ${newHP}<br>`;
            chatContent += `AC: ${originalStats.AC} → ${newAC}`;
            chatContent += `</div>`;


        }
        await ChatMessage.create({
            user: game.user._id,
            content: chatContent,
            speaker: ChatMessage.getSpeaker()
        });

        ui.notifications.info(`Updated stats for ${beastActors.length} beast forms.`);
    } catch (error) {
        ui.notifications.error(`Error updating wild shape stats: ${error.message}`);
        console.error(error);
    }
}

UpdateWildShapeStats('Arbiter Wildshapes', '9nE8krcM2NSRG6Ui');