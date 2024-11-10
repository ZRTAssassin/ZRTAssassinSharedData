//Your game statistics are replaced by the Beast's stat block, but you retain your 
//creature type; Hit Points; Hit Point Dice; Intelligence, Wisdom, and Charisma scores; class features; languages; and feats. 
//You also retain your skill and saving throw proficiencies and use your Proficiency Bonus for them, in addition to gaining the proficiencies of the creature. 
//If a skill or saving throw modifier in the Beast's stat block is higher than yours, use the one in the stat block.


// Define parent and child actor IDs
//TODO: pick from a list of wildshapes, program the actor ids into the choices
const parentActorId = "9nE8krcM2NSRG6Ui";
const childActorId = "eYGHsybRSqVmuodT";

// Get the parent and child actors from the game
const parentActor = game.actors.get(parentActorId);
const childActor = game.actors.get(childActorId);
console.log("parentActor", parentActor);
console.log("childActor", childActor);


// Check if the actors exist
if (!parentActor || !childActor) {
    ui.notifications.error("Could not find the specified actors.");
    return;
}

//testing HP
const childHPValue = childActor.system.attributes.hp.value;
const childHPMax = childActor.system.attributes.hp.value;
//console.log("childHPValue", childHPValue, "childHPMax", childHPMax);

// Get the parent actor's current HP
const parentHP = parentActor.system.attributes.hp.value;
const parentHPMax= parentActor.system.attributes.hp.max;
//console.log("parentHP", parentHP, "parentHPMax", parentHPMax);

// Calculate the temporary HP (4 times the druid level)
const druidLevel = parentActor.classes.druid.system.levels;
//todo: configure to be 4 if super transformation from item
const tempHP = 3 * druidLevel;
//console.log("druidLevel", druidLevel,"tempHP", tempHP);

//ability scores
const parentIntScore = parentActor.system.abilities.int.value;
const parentWisScore = parentActor.system.abilities.wis.value;
const parentChaScore = parentActor.system.abilities.cha.value;
const childIntScore = childActor.system.abilities.int.value;
const childWisScore = childActor.system.abilities.wis.value;
const childChaScore = childActor.system.abilities.cha.value;
console.log(`Parent Actor: Intelligence: ${parentIntScore}, Wisdom: ${parentWisScore}, Intelligence: ${parentChaScore } | Child Actor: Intelligence: ${childIntScore}, Wisdom: ${childWisScore}, Intelligence: ${childChaScore }`);

// Access skill proficiencies
const parentSkills = parentActor.system.skills;
const childSkills = childActor.system.skills;
// Log all skills and their proficiency status
var proficientSkills = [];
for (var key in parentSkills) {
    if (parentSkills.hasOwnProperty(key) && parentSkills[key].proficient === 1) {
        proficientSkills.push(key);
    }
}
console.log(`ParentProfSkills: ${proficientSkills}`);

// Access saving throw proficiencies
const parentSaves = parentActor.system.abilities;
const childSaves = childActor.system.abilities;
let saveStr = `${parentSaves}`;
// Log all saving throw proficiencies
for (let [key, ability] of Object.entries(parentSaves)) {
    str += `${key}: Proficient - ${ability.proficient}, Value - ${ability.save} \n`;
    //console.log(`${key} Save: Proficient - ${ability.proficient}, Value - ${ability.save}`);
}
console.log(`Save String: ${saveStr}`);



return;
// Update the child actor's HP and temporary HP
await childActor.update({
    "system.attributes.hp.max": parentHPMax,    
    "system.attributes.hp.value": parentHP,
    "system.attributes.hp.temp": tempHP
});

// Notify the user about the updates
ui.notifications.info(`Child actor's HP set to ${parentHP} and Temp HP set to ${tempHP}.`);


return;
//flags
// Set a flag on the child actor to reference the parent actor
return;
childActor.setFlag("world", "parentActor", parentActorId);
console.log("here1");



async function RenderDialogeBox(){
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
}


class WildShapeResults {

}