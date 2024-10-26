let targetedActor = game.user.targets.first();

let actorId = "ZkJUVPSwXmDIzySu";

let controlledActor = game.actors.get(actorId);



console.log(targetedActor);

if (targetedActor && controlledActor) {
    let actor = targetedActor.actor;
    // Now you can access the hit dice
    console.log('actor', actor);
    let charismaModifier = controlledActor.system.abilities.cha.mod;

    let hitDiceSizes = actor.system.attributes.hd.sizes;
    console.log(hitDiceSizes);
    console.log(actor.system.attributes.hd.classes.entries);

    if (hitDiceSizes.size > 0) {
        // Convert set to array and sort in descending order
        let sortedSizes = Array.from(hitDiceSizes).sort((a, b) => {
            return parseInt(b.slice(1)) - parseInt(a.slice(1));
        });

        // The first element is now the highest
        let highestHitDie = sortedSizes[0];

        console.log("Highest Hit Die:", highestHitDie);
        
          // Create and roll the die
          let roll = new Roll(`1d${highestHitDie} + ${charismaModifier}`);
          roll.evaluate({async: false});
          
          // Display the result
          let result = roll.total;
          let formula = roll.formula;
          
          console.log(`Rolled ${formula}: ${result}`);
          
          return;
          // Optionally, you can also show the roll in chat
          roll.toMessage({
              speaker: ChatMessage.getSpeaker({token: targetedActor}),
              flavor: `${actor.name} rolls their highest hit die`
          });

    } else {
        console.log("No token is currently targeted.");
    }
}