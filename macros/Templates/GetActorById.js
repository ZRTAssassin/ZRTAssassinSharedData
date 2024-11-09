const actorId = 'ez4qAGiUi2DzjmH5';
let controlledActor = game.actors.get(actorId);
console.log(controlledActor);



//While selecting a token, execute the macro. Then, look at the console. //This will tell you all the data that is available to you when writing //a formula.
console.log(controlledActor.getRollData())