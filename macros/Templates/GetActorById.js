const actorId = 'ECbH2yr4BL2jmEeP';
let controlledActor = game.actors.get(actorId);
console.log(controlledActor);
//console.log(controlledActor.sourcedItems);
const itemId = 'Actor.ECbH2yr4BL2jmEeP.Item.UiNkiekPv4Sess8n';
//controlledActor.sourcedItems
//path to temp hp:
//system.attributes.hp
//item.formula
//
const items = controlledActor.items;
let itemsArray = items instanceof Map ? Array.from(items.values()) : items;
const vitalSacrificeItem = itemsArray.find(item => item._id === 'UiNkiekPv4Sess8n');
const abhClass = itemsArray.find(item => item.name === "Alternate Blood Hunter");
let advancementArray = abhClass.system.advancement.find(item => item.title == "Rite Die");
let bhLevel = controlledActor.classes['alternate-blood-hunter'].system.levels;
//popup to deduct from temp hp or max hp, with a default to temp hp
const tempHPAmountBefore = controlledActor.system.attributes.hp.temp;
const maxHPAmountBefore = controlledActor.system.attributes.hp.effectiveMax;
const tempHpString = `${tempHPAmountBefore}`;
const maxHpString = `${maxHPAmountBefore}`;
let optionsStr = ``;
if (tempHPAmountBefore > 0) {
    optionsStr =
        `<option value="temp">Temp (${tempHpString})</option>
        <option value="max">Max (${maxHpString})</option>`
} else {
    optionsStr = `<option value="max">${maxHpString}</option>`
}
console.log(controlledActor.system.attributes.hp);
const promptResponse = await Dialog.prompt({
    title: 'Vital Sacrifice',
    content: `<form>
    <fieldset>
    <legend>HP Pool</legend>
    <div class="form-group">
        <label>HP Pool to use:</label>
        <div class="form-fields">
            <select id="hpPool" name="hpPool">
            ${optionsStr}
            </select>
        </div>
    </div>
</div>
    </fieldset>
  </form>`,
    callback: html => new Array(
        html.find('select[name=hpPool]').val()),
    close: () => null,
    rejectClose: false
});
console.log(typeof (promptResponse), promptResponse);
if (promptResponse == undefined || promptResponse.length != 1) {
    return;
}
const hpPool = promptResponse[0];
let vitalSacrificeHpPoolString = '';
let vitalSacrificeMaxHPString = '';
let vitalSacrificeRoll = `1d${getLevelDie(bhLevel)}`;
let damageRoll = await new Roll(vitalSacrificeRoll).roll();

// Calculate new HP values and update actor
const updateData = {
    "system.attributes.hp": {}
};

let newHp, maxHp;
if (hpPool === 'max') {
    newHp = maxHPAmountBefore;
    maxHp = maxHPAmountBefore - damageRoll.total;
    updateData["system.attributes.hp.max"] = maxHp;
    vitalSacrificeHpPoolString = ` Their Max HP has been reduced from ${newHp} to ${maxHp}.`
} else if (hpPool === 'temp') {
    newHp = tempHPAmountBefore;
    maxHp = Math.max(0, tempHPAmountBefore - damageRoll.total);
    updateData["system.attributes.hp.temp"] = maxHp;
    vitalSacrificeHpPoolString = ` Their HP has been reduced from ${newHp} to ${maxHp}.`
}

await controlledActor.update(updateData);

let customContent = ``;
customContent = customContent + `<div style="">`;
customContent = customContent + `<div>${await damageRoll.render()}</div>`;
customContent = customContent + `<div style="">`;
customContent = customContent + `${controlledActor.name} uses vital sacrifice and loses ${damageRoll.total} points.` + `${vitalSacrificeHpPoolString}`;
customContent = customContent + `</div>`;
customContent = customContent + `</div>`;
ChatMessage.create({
    roll: damageRoll,
    //content: await roll.render({ flavor: flavorText}),
    content: customContent,
    sound: CONFIG.sounds.dice,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    speaker: ChatMessage.getSpeaker({ actor: controlledActor }),
});
function getLevelDie(level) {
    if (level < 5) return 4;
    if (level < 11) return 6;
    if (level < 17) return 8;
    return 10;
}
console.log("itemsArray", itemsArray);
console.log(vitalSacrificeItem);
console.log(vitalSacrificeItem.system.formula);
console.log(controlledActor.system.attributes.hp);
console.log(abhClass);
console.log(abhClass.system.advancement);
console.log(advancementArray);
console.log(advancementArray.configuration.scale);
console.log(getLevelDie(bhLevel));