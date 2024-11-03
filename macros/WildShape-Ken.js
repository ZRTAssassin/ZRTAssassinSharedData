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

        // Get and validate the druid's stats with safety checks
        const druidStats = {
            maxHP: druidActor.system?.attributes?.hp?.max ?? 0,
            currentHP: druidActor.system?.attributes?.hp?.value ?? 0,
            level: druidActor.classes?.druid?.system?.levels ?? 0
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

        // Get all actors in the folder
        const beastActors = folder.contents.filter(item => item.documentName === "Actor");
        if (!beastActors.length) {
            ui.notifications.warn("No beast actors found in folder.");
            return;
        }

        // Prepare chat message content
        let chatContent = `<h3>Wild Shape Stats Update</h3>`;
        chatContent += `<p>Druid Level: ${druidStats.level}</p>`;
        chatContent += `<hr>`;

        // Update each beast actor
        for (let beastActor of beastActors) {
            // Get original stats
            const originalStats = {
                maxHP: beastActor.system?.attributes?.hp?.max ?? 0,
                currentHP: beastActor.system?.attributes?.hp?.value ?? 0,
                tempHP: beastActor.system?.attributes?.hp?.temp ?? 0
            };


            const newHP = druidStats.level;

            // Update the actor
            await beastActor.update({
                "system.attributes.hp.max": druidStats.maxHP,
                "system.attributes.hp.value": druidStats.currentHP,
                "system.attributes.hp.temp": newHP
            });

            // Add to chat content
            chatContent += `<div style="margin-bottom: 10px;">`;
            chatContent += `<strong>${beastActor.name}</strong><br>`;
            chatContent += `Max HP: ${originalStats.maxHP} → ${druidStats.maxHP}<br>`;
            chatContent += `Current HP: ${originalStats.currentHP} → ${druidStats.currentHP}<br>`;
            chatContent += `Temp HP: ${originalStats.tempHP} → ${newHP}`;
            chatContent += `</div>`;
        }

        // Send chat message
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

UpdateWildShapeStats('Ken Wildshapes', 'hRM1mIEOrBkOxwkD');