
let targetedActor = game.user.targets.first();
if (!targetedActor) {
    console.log("No token is currently targeted.");
    return;
}

let actorId = "ZkJUVPSwXmDIzySu";
let controlledActor = game.actors.get(actorId);
if (!controlledActor) {
    console.log("No controlled actor found.");
    return;
}

let actor = targetedActor.actor;
if (!actor) {
    console.log("No actor found on the targeted token.");
    return;
}

let charismaModifier = controlledActor.system.abilities.cha.mod;

// Check if the targeted actor is an NPC
let hitDiceSizes;

if (actor.type === "npc" || actor.type === "monster") {
    // For NPCs, extract the hit die denomination
    const hitDieDenomination = actor.system.attributes.hd?.denomination;
    if (hitDieDenomination) {
        hitDiceSizes = [hitDieDenomination]; // Populate sizes with a single element array
    } else {
        console.log("No hit dice found for this NPC.");
        return;
    }
} else {
    // For player characters, use the existing hit dice sizes
    hitDiceSizes = actor.system.attributes.hd.sizes;
}

// Proceed if hit dice sizes were correctly populated
if (hitDiceSizes.length === 0) {
    console.log("No valid hit dice available.");
    return;
}



// Convert set to array and sort in descending order to get the highest hit die
let sortedSizes = Array.from(hitDiceSizes).sort((a, b) => parseInt(b.slice(1)) - parseInt(a.slice(1)));
let highestHitDie = sortedSizes[0];
console.log("Highest Hit Die:", highestHitDie);

// Find and use "Inspiring Word" feature
let inspiringWord = controlledActor.items.find(item => item._id === "WgNnrfsskNnMO0jZ");
if (!inspiringWord) {
    console.log("Inspiring Word feature not found on the controlled actor.");
    return;
}
console.log("Inspiring word:", inspiringWord);


// Check if the current user has permission to update the controlled actor or if they are a GM
if (!(controlledActor.isOwner || game.user.isGM)) {
    console.log("User does not have permission to edit the controlled actor.");
    ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: controlledActor }),
        content: `You do not have permission to use Inspiring Word on ${controlledActor.name}.`
    });
    return;
}

// If the user is an owner or GM, proceed with using "Inspiring Word"
// Check if "Inspiring Word" has uses left
let uses = inspiringWord.system.uses;
if (!uses || uses.value <= 0) {
    console.log("Inspiring Word has no uses left.");
    ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: controlledActor }),
        content: `${controlledActor.name} tries to use Inspiring Word, but has no uses left!`
    });
    return;
}

// Decrement the use ahead of time
uses.value -= 1;
controlledActor.updateEmbeddedDocuments("Item", [{
    _id: inspiringWord.id,
    "system.uses.value": uses.value
}]);
console.log(`Using Inspiring Word. Remaining uses: ${uses.value}`);
try {
    // Create and roll the die
    let roll = new Roll(`1d${highestHitDie} + ${charismaModifier}`);
    roll.evaluate({ async: false });

    // Check if the roll succeeded without error
    if (isNaN(roll.total)) {
        throw new Error("Invalid roll result");
    }

    // Roll was successful, display the result
    console.log(`Rolled ${roll.formula}: ${roll.total}`);
    roll.toMessage({
        speaker: ChatMessage.getSpeaker({ token: targetedActor }),
        flavor: `${actor.name} successfully uses their highest hit die for healing`
    });

    // Calculate the healing amount
    let healingAmount = roll.total;
    let currentHp = actor.system.attributes.hp.value;
    let maxHp = actor.system.attributes.hp.max;

    let newHp = Math.min(currentHp + healingAmount, maxHp);

    if (controlledActor.isOwner || game.user.isGM) {
        // Automatically apply the healing since we have permission
        targetedActor.actor.update({ "system.attributes.hp.value": newHp });
        console.log(`Applied ${healingAmount} healing to ${actor.name}. New HP: ${newHp}`);

        // Inform the players of the automatic update
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor: controlledActor }),
            content: `${actor.name} is healed for ${healingAmount} points. Their HP has been updated to ${newHp}/${maxHp}.`
        });
    } else {
        // Inform the players to manually apply the healing
        let healingMessage = `${actor.name} receives ${healingAmount} points of healing. Their HP should be updated to ${newHp}/${maxHp}.`;
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor: controlledActor }),
            content: healingMessage
        });
    }

} catch (error) {
    console.error("An error occurred during the roll or message creation:", error);

    // Refund the use because an error occurred
    uses.value += 1;
    controlledActor.updateEmbeddedDocuments("Item", [{
        _id: inspiringWord.id,
        "system.uses.value": uses.value
    }]);
    console.log(`An error occurred. Refunding use of Inspiring Word. Remaining uses: ${uses.value}`);

    ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: controlledActor }),
        content: `${controlledActor.name} attempted to use Inspiring Word, but something went wrong. The use has been refunded.`
    });
}
