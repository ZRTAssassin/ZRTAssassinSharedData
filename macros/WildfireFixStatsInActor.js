const wildfireActorId = "tokjXGkiRO8EsqSH";
const wildfireSpirit = game.actors.get(wildfireActorId);
const enhancedwildfireActorId = "3kT2tSQbJhVKjXXD";
const enhancedwildfireSpirit = game.actors.get(enhancedwildfireActorId);
const druidActorId = "hRM1mIEOrBkOxwkD";
const druidActor = game.actors.get(druidActorId);

if (druidActor) {
    let chatContent = `<h3>Wildfire Spirit Updates</h3>`;
    chatContent += `<p>Druid Level: ${druidActor.classes.druid.system.levels}</p>`;
    chatContent += `<hr>`;

    const proficiencyBonus = druidActor.system.attributes.prof;
    const spellMod = druidActor.system.attributes.spellmod;
    const spellSaveDC = druidActor.system.attributes.spelldc;
    const spellAttackBonus = spellMod + proficiencyBonus;
    
    let parentActor = {
        proficiencyBonus,
        spellMod,
        spellAttackBonus,
        spellSaveDC,
        druidLevels: druidActor.classes.druid.system.levels,
        isEnhanced: false
    }

    // Update regular spirit and add to chat content
    chatContent += await UpdateSpirit(wildfireSpirit, parentActor);

    // Update enhanced spirit stats
    parentActor.proficiencyBonus += 1;
    parentActor.spellAttackBonus = parentActor.spellMod + parentActor.proficiencyBonus;
    parentActor.spellSaveDC += 1;
    parentActor.isEnhanced = true;
    
    // Update enhanced spirit and add to chat content
    chatContent += await UpdateSpirit(enhancedwildfireSpirit, parentActor);

    // Post the complete message
    await ChatMessage.create({ content: chatContent });
} else {
    await ChatMessage.create({ content: "Error: Druid actor not found" });
}

async function UpdateSpirit(wildfireSpirit, parentActor) {
    if (!wildfireSpirit) {
        return `<div class="error">Error: Wildfire Spirit actor not found</div>`;
    }

    let items = wildfireSpirit.items;
    let itemsArray = items instanceof Map ? Array.from(items.values()) : items;

    // Calculate new values
    const newHP = 5 + (5 * parentActor.druidLevels);
    const newAC = parentActor.isEnhanced ? 13 + parentActor.spellMod : 13;
    const newTempHP = parentActor.isEnhanced ? parentActor.proficiencyBonus * 2 : 0;

    // Get original values for comparison
    const originalHP = wildfireSpirit.system.attributes.hp.value;
    const originalAC = wildfireSpirit.system.attributes.ac.value;
    const originalTempHP = wildfireSpirit.system.attributes.hp.temp;

    let updateData = {
        "system.attributes.hp.value": newHP,
        "system.attributes.hp.max": newHP,
        "system.attributes.ac.value": newAC
    };

    if (parentActor.isEnhanced) {
        updateData["system.attributes.hp.temp"] = newTempHP;
    }

    let itemUpdates = [];
    let abilityUpdates = [];

    const flameSeed = itemsArray.find(item => item.name === "Flame Seed");
    if (flameSeed) {
        const originalAttack = flameSeed.system.attack.bonus;
        const originalDamage = flameSeed.system.damage.parts[0][0];
        
        itemUpdates.push({
            _id: flameSeed.id,
            "system.attack.bonus": `+ ${parentActor.spellAttackBonus}`,
            "system.damage.parts": [[`1d6 + ${parentActor.proficiencyBonus}`, "fire"]]
        });

        abilityUpdates.push({
            name: "Flame Seed",
            attack: `${originalAttack} → +${parentActor.spellAttackBonus}`,
            damage: `${originalDamage} → 1d6 + ${parentActor.proficiencyBonus}`
        });
    }

    const fieryTeleportation = itemsArray.find(item => item.name === "Fiery Teleportation");
    if (fieryTeleportation) {
        const originalDC = fieryTeleportation.system.save.dc;
        const originalDamage = fieryTeleportation.system.damage.parts[0][0];

        itemUpdates.push({
            _id: fieryTeleportation.id,
            "system.save.dc": parentActor.spellSaveDC,
            "system.save.ability": "dex",
            "system.save.scaling": "flat",
            "system.damage.parts": [[`1d6 + ${parentActor.proficiencyBonus}`, "fire"]]
        });

        abilityUpdates.push({
            name: "Fiery Teleportation",
            dc: `DC ${originalDC} → DC ${parentActor.spellSaveDC}`,
            damage: `${originalDamage} → 1d6 + ${parentActor.proficiencyBonus}`
        });
    }

    if (itemUpdates.length > 0) {
        updateData.items = itemUpdates;
    }

    // Create spirit section for chat message
    let spiritContent = `<div style="margin-bottom: 10px;">`;
    spiritContent += `<strong>${parentActor.isEnhanced ? "Enhanced " : ""}${wildfireSpirit.name}</strong><br>`;
    spiritContent += `Max HP: ${originalHP} → ${newHP}<br>`;
    spiritContent += `AC: ${originalAC} → ${newAC}<br>`;
    if (parentActor.isEnhanced) {
        spiritContent += `Temp HP: ${originalTempHP} → ${newTempHP}<br>`;
    }
    spiritContent += `</div>`;

    if (abilityUpdates.length > 0) {
        spiritContent += `<div style="margin-left: 10px;">`;
        for (let ability of abilityUpdates) {
            spiritContent += `<strong>${ability.name}</strong><br>`;
            if (ability.attack) spiritContent += `Attack: ${ability.attack}<br>`;
            if (ability.dc) spiritContent += `Save: ${ability.dc}<br>`;
            spiritContent += `Damage: ${ability.damage}<br>`;
        }
        spiritContent += `</div>`;
    }

    try {
        await wildfireSpirit.update(updateData);
        return spiritContent;
    } catch (error) {
        return `<div class="error">Error updating ${wildfireSpirit.name}: ${error.message}</div>`;
    }
}