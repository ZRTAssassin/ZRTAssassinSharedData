let selected = canvas.tokens.controlled;
if (selected.length == 0 || selected.length > 1) {
    ui.notifications.error("Please select a single controlled token.");
    return;
}

let targets = Array.from(game.user.targets);
if (targets.length == 0 || targets.length > 1) {
    ui.notifications.error("Please target a single character.");
    return;
}


let promptResponse = await Dialog.prompt({
    title: 'Attack',
    content: `<form>
    <fieldset>
    <legend>Attack roll</legend>
    <div class="form-group">
        <label>Attribute:</label>
        <div class="form-fields">
            <select id="modifier" name="modifier">
                <option value="str">Strength</option>
                <option value="dex">Dexterity</option>
                <option value="con">Constitution</option>
                <option value="int">Intelligence</option>
                <option value="wis">Wisdom</option>
                <option value="cha">Charisma</option>
            </select>
        </div>
    </div>
    <div class="form-group"><label>Enemy AC Bonus:</label><div class="form-fields"><input id="enemyAc" type="number" value="0" /></div></div>
    </fieldset>
    <fieldset>
    <legend>Damage roll</legend>
    <div class="form-group"><label>Number of Damage Dice:</label><div class="form-fields"><input id="numDamageDice" type="number" value="1" placeholder="1" /></div></div>
    <div class="form-group">
        <label>Dice Size:</label>
        <div class="form-fields">
            <select id="diceSize" name="diceSize">
            <option value="2">d2</option>
            <option value="4">d4</option>
            <option value="6">d6</option>
            <option value="8">d8</option>
            <option value="10">d10</option>
            <option value="12">d12</option>
            <option value="20">d20</option>
            </select>
        </div>
    </div>
    <div class="form-group">
        <label>Has Advantage:</label>
        <div class="form-fields">
            <input id="hasAdvantage" type="checkbox" />
        </div>
    </div>
    </fieldset> 
  </form>`,
    callback: html => new Array(html.find('select[name=modifier]').val(),
        html.find('#enemyAc').val(),
        html.find('#numDamageDice').val(),
        html.find('select[name=diceSize]').val(),
        html.find('#hasAdvantage').prop('checked')),
    close: () => null,
    rejectClose: false
});
console.log(typeof (promptResponse), promptResponse);
if (promptResponse == undefined || promptResponse.length != 5) {
    return;
}

let modifier = promptResponse[0];
let acBonus = promptResponse[1];
let numDamageDice = promptResponse[2];
let diceSize = promptResponse[3];
let hasAdvantage = promptResponse[4];
if (!modifier || !acBonus || !numDamageDice || !diceSize) {
    return;
}

console.log(numDamageDice, diceSize);

//console.log(modifier, acBonus);

//console.log("acBonus: ", acBonus);

//console.log(`modidfier  selected was ${modifier}`);

let actors = canvas.tokens.controlled.map(token => {
    return token.actor;
});
//console.log("actors");
//console.log(actors);
//get computed modifier
let computedModifier = actors[0].data.data.computed.attributes[`${modifier}`].mod;
if (computedModifier) {
    //console.log(`computed: ${computedModifier}`)
    //console.log(computedModifier)

}
let level = actors[0].data.data.level;
if (actors) {
    //console.log(`Level: ${level}`);
}

//convert values to numbers
let parsedLevel = parseInt(level, 10);
let parsedACBonus = parseInt(acBonus, 10);
let parsedComputedModifier = parseInt(computedModifier, 10);

let tokenName = actors[0].data.name;
let targetName = game.user.targets.first().actor.name;


if (modifier && parsedComputedModifier && parsedLevel && typeof (parsedACBonus) != undefined) {
    let flavorText = `${tokenName} targets ${targetName}`;
    let totalModifier = parsedLevel + parsedACBonus + parsedComputedModifier;
    //console.log(`parsedLevel: ${parsedLevel}, parsedACBonus: ${parsedACBonus}, parsedComputedModifier: ${parsedComputedModifier}, totalModifier: ${totalModifier}`);

    let attackString = getActualDiceRollString();
    console.log("attackString:", attackString)
    let attackRoll = await new Roll(`${attackString} + ${parsedACBonus} + ${parsedLevel} + ${parsedComputedModifier}`).roll({ async: true })
    let customContent = `
    <div style="text-align: center">${flavorText}</div>
    <div style="outline: thin solid black; margin-top: 10px;">
    <div style="text-align: center;">Attack roll</div>
    `;
    customContent = customContent + `<div>${await attackRoll.render()}</div></div>`;


    if (numDamageDice > 1) {

        //need to loop over the number of damage dice and do that here.
        let multiDamageRoll = "";

        for (let i = 0; i < numDamageDice; i++) {
            let currentDamageRoll = await new Roll(`1d${diceSize}`);
            let mappedDamage = getActualDamage(currentDamageRoll.total);

            if (attackRoll.total > 20){
                customContent = customContent + `<div style="outline: thin solid black; margin-top: 10px">`;
                customContent = customContent + `<div style="text-align: center;">Damage roll</div>`;
                customContent = customContent + `<div>${await currentDamageRoll.render()}</div>`;
                customContent = customContent + `<div style="display: flex; justify-content: space-between; font-size: large;"><p>Actual Damage: </p><p>${mappedDamage}</p></div>`;
                customContent = customContent + `</div>`;
            }
        }
    } else {


        let damageRoll = await new Roll(`1d${diceSize} + ${parsedComputedModifier}`).roll({ async: true });

        console.log(attackRoll.result, attackRoll.total, damageRoll.result, damageRoll.total);


        let mappedDamage = getActualDamage(damageRoll.total);
        console.log("mappedDamage", mappedDamage);

        if (attackRoll.total > 20) {
            //customContent = customContent + `<div style="display: flex; justify-content: center;">Above 20 means hit.</div>`;
            customContent = customContent + `<div style="outline: thin solid black; margin-top: 10px">`;
            customContent = customContent + `<div style="text-align: center;">Damage roll</div>`;
            customContent = customContent + `<div>${await damageRoll.render()}</div>`;
            customContent = customContent + `<div style="display: flex; justify-content: space-between; font-size: large;"><p>Actual Damage: </p><p>${mappedDamage}</p></div>`;
            customContent = customContent + `</div>`;
            //customContent = customContent + `<div></div>`;


        }
    }


    // Roll with flavor text
    //let roll = await new Roll(`1d20 + ${parsedACBonus} + ${parsedLevel} + ${parsedComputedModifier}`).roll({async: true}).toMessage({ flavor: 'Example Flavor' });
    ChatMessage.create({
        roll: attackRoll,
        //content: await roll.render({ flavor: flavorText}),
        content: customContent,
        sound: CONFIG.sounds.dice,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL
    })
}



for (let i = 0; i < 20; i++) {

    //console.log("damage roll: ", i, "mapped damage:", getActualDamage(i));
}

function getActualDiceRollString(){
    if (hasAdvantage){
        return "2d20dl1";
    } else {
        return "1d20";
    }

}

function getActualDamage(damageAmount) {
    if (damageAmount >= 10) {
        return 4;
    }
    else if (damageAmount >= 6) {
        return 2;
    }
    else if (damageAmount >= 2) {
        return 1;
    } else {
        return 0;
    }
}