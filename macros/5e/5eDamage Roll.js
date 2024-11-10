// let selected = canvas.tokens.controlled;
// if (selected.length == 0 || selected.length > 1) {
//     ui.notifications.error("Please select a single controlled token.");
//     return;
// }

// let targets = Array.from(game.user.targets);
// if (targets.length == 0 || targets.length > 1) {
//     ui.notifications.error("Please target a single character.");
//     return;
// }


let promptResponse = await Dialog.prompt({
    title: 'Damage',
    content: `<form>
    <fieldset>
    <legend>Damage Calculation</legend>
    <div class="form-group">
        <label>Weapon Damage Dice:</label>
        <div class="form-fields">
            <select id="weaponDamageDice" name="weaponDamageDice">
                <option value="2d6rr1+1">2d6+1</option>
                <option value="1d12rr1">1d12</option>
                <option value="1d10rr1">1d10</option>
                <option value="1d8rr1">1d8</option>
                <option value="1d6rr1">1d6</option>
                <option value="1d4rr1">1d4</option>
            </select>
        </div>
    </div>
    <div class="form-group">
        <label>Strength Modifier:</label>
        <div class="form-fields">
            <select id="modifier" name="modifier">
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
            </select>
        </div>
    </div>
    <div class="form-group">
        <label>Curent Size:</label>
        <div class="form-fields">
            <select id="sizeMod" name="sizeMod">
                <option value="2d12">Gargantuan</option>
                <option value="1d6">Large</option>
                <option value="1d12">Huge</option>
                <option value="1d4">Medium</option>
            </select>
        </div>
    </div>
    <div class="form-group">
        <label>Weapon's current size?</label>
        <div class="form-fields">
            <select id="weaponSizeMod" name="weaponSizeMod">
                <option value="1d12rr1">Gargantuan</option>
                <option value="1d10rr1">Huge</option>
                <option value="1d8rr1">Large</option>
                <option value="1d6rr1">Medium</option>
                <option value="1d4rr1">Small</option>
            </select>
        </div>
    </div>
    <div class="form-group">
        <label>Damage Type</label>
        <div class="form-fields">
            <select id="dmgType" name="dmgType">
                <option value="bludgeoning">Bludgeoning</option>
                <option value="piercing">Piercing</option>
                <option value="slashing">Slashing</option>
            </select>
        </div>
    </div>
    <div class="form-group">
        <label>Signature Exploit?</label>
        <div class="form-fields">
            <input id="signatureExploit" type="checkbox" />
        </div>
    </div>
    <div class="form-group">
        <label>Free Hurl?</label>
        <div class="form-fields">
            <input id="freeHurl" type="checkbox" />
        </div>
    </div>
    <div class="form-group">
        <label>Raging?</label>
        <div class="form-fields">
            <input id="rage" type="checkbox" checked />
        </div>
    </div>
    
    <div class="form-group">
        <label>Great Weapon Master?</label>
        <div class="form-fields">
            <input id="gwm" type="checkbox" />
        </div>
    </div>

    <div class="form-group">
        <label>Standard Exploit?</label>
        <div class="form-fields">
            <input id="exploit" type="checkbox" />
        </div>
    </div>
    <div class="form-group">
        <label>Is Crit?</label>
        <div class="form-fields">
            <input id="isCrit" type="checkbox" />
        </div>
    </div>
    <div class="form-group">
        <label>Is enlarged?</label>
        <div class="form-fields">
            <input id="isEnglarged" type="checkbox" checked />
        </div>
    </div>
</div>

    </fieldset> 
  </form>`,
    callback: html => new Array(
        html.find('select[name=weaponDamageDice]').val(),
        html.find('select[name=modifier]').val(),
        html.find('select[name=sizeMod]').val(),
        html.find('select[name=weaponSizeMod]').val(),
        html.find('select[name=dmgType]').val(),
        html.find('#signatureExploit').prop('checked'),
        html.find('#freeHurl').prop('checked'),
        html.find('#rage').prop('checked'),
        html.find('#gwm').prop('checked'),
        html.find('#exploit').prop('checked'),
        html.find('#isCrit').prop('checked'),
        html.find('#isEnglarged').prop('checked')),
    close: () => null,
    rejectClose: false
});
console.log(typeof (promptResponse), promptResponse);
if (promptResponse == undefined || promptResponse.length != 12) {
    return;
}

let weaponDamageDice = promptResponse[0];
let modifier = promptResponse[1];
let sizeMod = promptResponse[2];
let weaponSizeMod = promptResponse[3];
let dmgType = promptResponse[4];
let signatureExploit = promptResponse[5];
let freeHurl = promptResponse[6];
let isRaging = promptResponse[7];
let gwm = promptResponse[8];
let exploit = promptResponse[9];
let isCrit = promptResponse[10];
console.log("here 2");
let isEnglarged = promptResponse[11];
let exploitDieSize = '1d6'
console.log("here");
if (!weaponDamageDice || !modifier || !sizeMod || !weaponSizeMod || !dmgType) {
    console.error(`Mod: ${modifier}, Size Mod: ${sizeMod}, Weapon Size Mod: ${weaponSizeMod}, Damage Type: ${dmgType}, Signature exploit: ${signatureExploit}, Free Hurl: ${freeHurl}`);
    return;
}
// console.log(`Mod: ${modifier}, Size Mod: ${sizeMod}, Weapon Size Mod: ${weaponSizeMod}, Damage Type: ${dmgType}, Signature exploit: ${signatureExploit}, Free Hurl: ${freeHurl}, IsRaging: ${isRaging}`);

//convert values to numbers
let parsedModifier = parseInt(modifier, 10);
// let tokenName = actors[0].data.name;
// console.log(tokenName);
//console.log('parsedMod', parsedModifier);
console.log("parsedMod", parsedModifier);
if (parsedModifier != undefined) {
    
    // let customContent = `
    // <div style="text-align: center">${flavorText}</div>
    // <div style="outline: thin solid black; margin-top: 10px;">
    // <div style="text-align: center;">Attack roll</div>
    // `;

    let customContent = ``;
    let flavorString = ``;
    
    let damageRollString = ``;
    if (isRaging)
    {
        damageRollString += `${weaponDamageDice} + ${parsedModifier} + ${exploitDieSize} + ${sizeMod} + ${weaponSizeMod}`;
        flavorString += `Weapon Damage + Signature Weapon + Str Mod + Rage Bonus + Size Bonus + Weapon Size Bonus`;
        if (isCrit){
            damageRollString += ` + ${weaponDamageDice} + ${weaponDamageDice} + ${exploitDieSize} + ${sizeMod} + ${weaponSizeMod}`;
            flavorString += ` + Weapon Damage (Crit) + Weapon Damage (SA Crit Bonus) + Signature Weapon (Crit) + Rage Bonus (Crit) + Size Bonus (Crit) + Weapon Size Bonus (Crit)`;
        } 

        
        if (freeHurl)
            {
                damageRollString += `+ ${exploitDieSize}`;
                flavorString += ` + Hurl Damage`

                if (isCrit){
                    damageRollString += ` + ${exploitDieSize}`;
                    flavorString += ` + Hurl Damage (Crit)`    
                }
            }
    }
    else
    {
        damageRollString += `${weaponDamageDice} + ${parsedModifier} + ${weaponSizeMod}`;
        flavorString += `Weapon Damage + Signature Weapon + Str Mod +  Weapon Size Bonus`;
        if (isCrit){
            damageRollString += `${weaponDamageDice} + ${weaponSizeMod}`;
            flavorString += ` + Weapon Damage (Crit) + Signature Weapon (Crit) + Weapon Size Bonus (Crit)`    
        }
    }
    if (exploit){
        damageRollString += `+ 1d6`;
        flavorString += ` + Exploit Damage`
        if (isCrit){
            damageRollString += `+ 1d6`;
            flavorString += ` + Exploit Damage (Crit)`
        }
    }

    if (signatureExploit){
        damageRollString += `+ 1d4`;
        flavorString += ` + Ruthless Strike Damage`
        if (isCrit){
            damageRollString += `+ 1d4`;
            flavorString += ` + Ruthless Strike Damage (Crit)`
        }
    }
    console.log("isEnlarged", isEnglarged);
    if (isEnglarged){
        damageRollString += `+ 1d4`;
        flavorString += ` + Enlarge Spell Damage`
        if (isCrit){
            damageRollString += `+ 1d4`;
            flavorString += ` + Enlarge Spell Damage (Crit)`
        }
    }
    let damageRoll = await new Roll(damageRollString).roll({ async: true });

    // console.log(damageRoll.result, damageRoll.total);

    //customContent = customContent + `<div style="display: flex; justify-content: center;">Above 20 means hit.</div>`;
    customContent = customContent + `<div style="margin-top: 10px">`;
    customContent = customContent + `<div style="text-align: center;">Damage roll</div>`;
    customContent = customContent + `<div>${await damageRoll.render()}</div>`;
    customContent = customContent + `<div style="margin-top: 10px; text-align: center;">Damage Type: ${dmgType}</div>`;
    customContent = customContent + `</div>`;
    customContent = customContent + `<div style="margin-top: 10px">`;
    customContent = customContent + `<div style="text-align: center;">Modifiers</div>`;
    customContent = customContent + `<div>${flavorString}</div>`;
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
}



