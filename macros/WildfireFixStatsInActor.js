const wildfireActorId = "tokjXGkiRO8EsqSH";
const wildfireSpirit = game.actors.get(wildfireActorId);
const enhancedwildfireActorId = "3kT2tSQbJhVKjXXD";
const enhancedwildfireSpirit = game.actors.get(enhancedwildfireActorId);
const druidActorId = "hRM1mIEOrBkOxwkD";
const druidActor = game.actors.get(druidActorId);



if (druidActor) {
    // Get proficiency bonus
    const proficiencyBonus = druidActor.system.attributes.prof;
    const spellMod = druidActor.system.attributes.spellmod;
    const spellSaveDC = druidActor.system.attributes.spelldc;
    const spellAttackBonus = spellMod + proficiencyBonus;
    console.log("druid attributes:", druidActor.system.attributes);
    console.log("Proficiency Bonus:", proficiencyBonus, "Spell Mod:", spellMod, "spellAttackBonus:", spellAttackBonus);
    let parentActor = {
        proficiencyBonus,
        spellMod,
        spellAttackBonus,
        spellSaveDC,
        druidLevels: druidActor.classes.druid.system.levels,
        isEnhanced: false,
        profBonus: proficiencyBonus
    }
    console.log("ParentActor", parentActor);

    UpdateSpirit(wildfireSpirit, parentActor);

    parentActor.proficiencyBonus = parentActor.proficiencyBonus + 1;
    parentActor.spellAttackBonus = parentActor.spellMod + parentActor.proficiencyBonus;
    parentActor.spellSaveDC = parentActor.spellSaveDC + 1;
    parentActor.isEnhanced = true;
    
    console.log("ParentActorAfter:", parentActor)
    UpdateSpirit(enhancedwildfireSpirit, parentActor);
} else {
    console.log("Druid actor not found");
}


async function UpdateSpirit(wildfireSpirit, parentActor) {
    if (wildfireSpirit) {
        console.log("WildfireSpirit: ", wildfireSpirit);
        let items = wildfireSpirit.items;
        let itemsArray = items instanceof Map ? Array.from(items.values()) : items;

        let updateData = {
            "system.attributes.hp.value": 5 + (5 * parentActor.druidLevels),
            "system.attributes.hp.max": 5 + (5  * parentActor.druidLevels)
        };

        if (parentActor.isEnhanced){
            if (parentActor.isEnhanced) {
                updateData["system.attributes.ac.value"] = 13 + parentActor.spellMod;
                updateData["system.attributes.hp.temp"] = parentActor.profBonus * 2;
            } else {
                updateData["system.attributes.ac.value"] = 13;
            }
        }

        let itemUpdates = [];
        // Find the actions we want to change
        const flameSeed = itemsArray.find(item => item.name === "Flame Seed");
        if (flameSeed) {
            itemUpdates.push({
                _id: flameSeed.id,
                "system.attack.bonus": `+ ${parentActor.spellAttackBonus}`,
                "system.damage.parts": [[`1d6 + ${parentActor.proficiencyBonus}`, "fire"]]
            });

            // flameSeed.system.attack.bonus = `+ ${parentActor.spellAttackBonus}`;
            // flameSeed.system.damage.parts[0][0] = `1d6 + ${parentActor.proficiencyBonus}`;
            //console.log("Flame Seed action found:", flameSeed.system.damage);
        } else {
            console.log("Flame Seed action not found");
        }
        const fieryTeleportation = itemsArray.find(item => item.name === "Fiery Teleportation");
        if (fieryTeleportation) {
            console.log("fire", fieryTeleportation.system);
            itemUpdates.push({
                _id: fieryTeleportation.id,
                "system.save.dc": parentActor.spellSaveDC,
                "system.save.ability": "dex",
                "system.save.scaling": "flat",
                "system.damage.parts": [[`1d6 + ${parentActor.proficiencyBonus}`, "fire"]]
            });
            // fieryTeleportation.system.save.dc = parentActor.spellSaveDC;
            // fieryTeleportation.system.damage.parts[0][0] = `1d6 + ${parentActor.proficiencyBonus}`;
            // console.log("fieryTeleportation action found:", fieryTeleportation.system);
        }
        else {
            console.log("fieryTeleportation action not found");
        }

        if (itemUpdates.length > 0) {
            updateData.items = itemUpdates;
        }

        try {
            await wildfireSpirit.update(updateData);
            console.log("WildfireSpirit updated successfully");
        } catch (error) {
            console.error("Error updating WildfireSpirit:", error);
        }
        console.log("Update Data", updateData);
    } else {
        console.log("Actor not found");
    }

}