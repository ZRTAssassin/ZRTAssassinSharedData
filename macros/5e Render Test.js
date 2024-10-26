// let targets = Array.from(game.user.targets);
// if (targets.length == 0 || targets.length > 1) {
//     ui.notifications.error("Please target a single character.");
//     return;
// }



    let damageRollString = `4d6dl1`;
    let customContent = ``;
    let damageRoll = await new Roll(damageRollString).roll();

    console.log(damageRoll.result, damageRoll.total);
if (damageRoll.total >= 18){

    //customContent = customContent + `<div style="display: flex; justify-content: center;">Above 20 means hit.</div>`;
    customContent = customContent + `<div style="">`;
    customContent = customContent + `<div>${await damageRoll.render()}</div>`;
    customContent = customContent + `</div>`;
    //customContent = customContent + `<div></div>`;
    
    
    // Roll with flavor text
    //let roll = await new Roll(`1d20 + ${parsedACBonus} + ${parsedLevel} + ${parsedComputedModifier}`).roll({async: true}).toMessage({ flavor: 'Example Flavor' });
    ChatMessage.create({
        roll: damageRoll,
        //content: await roll.render({ flavor: flavorText}),
        content: customContent,
        sound: CONFIG.sounds.dice,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL
    })
} else {
    
}



