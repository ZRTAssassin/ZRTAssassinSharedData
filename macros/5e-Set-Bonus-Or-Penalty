const actorId = 'ez4qAGiUi2DzjmH5';
let controlledActor = game.actors.get(actorId);
Log('Controlled Actor:', controlledActor);
Log('Actor Roll Data:', controlledActor.getRollData());
Log('Actor Bonuses:', controlledActor.getRollData().bonuses);

// Store the initial values
const beforeValues = {
    mwak: controlledActor.system.bonuses.mwak.attack,
    rwak: controlledActor.system.bonuses.rwak.attack,
    msak: controlledActor.system.bonuses.msak.attack,
    rsak: controlledActor.system.bonuses.rsak.attack,
    check: controlledActor.system.bonuses.abilities.check,
    save: controlledActor.system.bonuses.abilities.save,
    skill: controlledActor.system.bonuses.abilities.skill
};

const promptResponse = await Dialog.prompt({
    title: 'Set Exhaustion Level',
    content: `<form>
    <fieldset>
    <legend>Exhaustion Level</legend>
    <div class="form-group">
        <label>Level:</label>
        <div class="form-fields">
            <select id="bonusAmount" name="bonusAmount">
                <option value="0">0</option>
                <option value="-1">1</option>
                <option value="-2">2</option>
                <option value="-3">3</option>
                <option value="-4">4</option>
                <option value="-5">5</option>
                <option value="-6">6</option>
                <option value="-7">7</option>
                <option value="-8">8</option>
                <option value="-9">9</option>
                <option value="-10">10</option>
            </select>
        </div>
    </div>
    </fieldset>
  </form>`,
    callback: html => html.find('select[name=bonusAmount]').val(),
    close: () => null,
    rejectClose: false
});

Log('Dialog Response:', promptResponse);

if (promptResponse === null || promptResponse === undefined) {
    Log('Dialog cancelled or closed');
    return;
}

const exhaustionLevel = parseInt(promptResponse);
Log('Parsed Exhaustion Level:', exhaustionLevel);

const updates = {
    'system.bonuses.mwak.attack': exhaustionLevel.toString(),
    'system.bonuses.rwak.attack': exhaustionLevel.toString(),
    'system.bonuses.msak.attack': exhaustionLevel.toString(),
    'system.bonuses.rsak.attack': exhaustionLevel.toString(),
    'system.bonuses.abilities.check': exhaustionLevel.toString(),
    'system.bonuses.abilities.save': exhaustionLevel.toString(),
    'system.bonuses.abilities.skill': exhaustionLevel.toString()
};

Log('Updates to be applied:', updates);

await controlledActor.update(updates);
Log('Updates applied successfully');

// Create the chat message content
const chatContent = `
<div class="dnd5e chat-card">
    <header class="card-header flexrow">
        <img src="${controlledActor.img}" title="${controlledActor.name}" width="36" height="36"/>
        <h3>Exhaustion Level Changed: ${controlledActor.name}</h3>
    </header>
    <div class="card-content">
        <table style="width: 100%; text-align: center;">
            <tr>
                <th style="text-align: left;">Bonus Type</th>
                <th>Before</th>
                <th>After</th>
            </tr>
            <tr>
                <td style="text-align: left;">Melee Weapon Attack</td>
                <td>${beforeValues.mwak || '0'}</td>
                <td>${exhaustionLevel}</td>
            </tr>
            <tr>
                <td style="text-align: left;">Ranged Weapon Attack</td>
                <td>${beforeValues.rwak || '0'}</td>
                <td>${exhaustionLevel}</td>
            </tr>
            <tr>
                <td style="text-align: left;">Melee Spell Attack</td>
                <td>${beforeValues.msak || '0'}</td>
                <td>${exhaustionLevel}</td>
            </tr>
            <tr>
                <td style="text-align: left;">Ranged Spell Attack</td>
                <td>${beforeValues.rsak || '0'}</td>
                <td>${exhaustionLevel}</td>
            </tr>
            <tr>
                <td style="text-align: left;">Ability Checks</td>
                <td>${beforeValues.check || '0'}</td>
                <td>${exhaustionLevel}</td>
            </tr>
            <tr>
                <td style="text-align: left;">Saving Throws</td>
                <td>${beforeValues.save || '0'}</td>
                <td>${exhaustionLevel}</td>
            </tr>
            <tr>
                <td style="text-align: left;">Skill Checks</td>
                <td>${beforeValues.skill || '0'}</td>
                <td>${exhaustionLevel}</td>
            </tr>
        </table>
    </div>
</div>`;

Log(chatContent);
// Send the chat message
await ChatMessage.create({
    user: game.user.id,
    speaker: ChatMessage.getSpeaker({ actor: controlledActor }),
    content: chatContent,
    type: CONST.CHAT_MESSAGE_TYPES.OTHER
});


const shouldLog = false;
function Log(string) {
    if (shouldLog == true) {
        console.log(string);
    }
}