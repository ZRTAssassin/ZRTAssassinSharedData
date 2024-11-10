const actorId = '8Rr3wYRw7XPDaJTz';
let controlledActor = game.actors.get(actorId);
console.log(controlledActor);



//While selecting a token, execute the macro. Then, look at the console. //This will tell you all the data that is available to you when writing //a formula.
console.log(controlledActor.getRollData());
console.log(controlledActor.getRollData().attributes.movement);
console.log(controlledActor.getRollData().attributes.movement.walk);