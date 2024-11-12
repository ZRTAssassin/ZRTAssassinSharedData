const actorId = '8Rr3wYRw7XPDaJTz';
let controlledActor = game.actors.get(actorId);
console.log(controlledActor);



//While selecting a token, execute the macro. Then, look at the console. //This will tell you all the data that is available to you when writing //a formula.
console.log(controlledActor.getRollData());
console.log(controlledActor.getRollData().attributes.movement);
console.log(controlledActor.getRollData().attributes.movement.walk);


```system.bonuses.mwak.attack```
```system.bonuses.rwak.attack```
```system.bonuses.rsak.attack```
```system.bonuses.abilities.save```
```system.bonuses.abilities.check```
```system.attributes.movement.burrow```
```system.attributes.movement.climb```
```system.attributes.movement.fly```
```system.attributes.movement.swim```
```system.attributes.movement.walk```



CONFIG.DND5E.conditionEffects.halfMovement.delete("exhaustion-2");
CONFIG.DND5E.conditionEffects.halfHealth.delete("exhaustion-4");
CONFIG.DND5E.conditionEffects.noMovement.delete("exhaustion-5");