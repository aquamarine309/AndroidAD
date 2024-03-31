import PrimaryButton from "./PrimaryButton.js";
import PrimaryToggleButton from "./PrimaryToggleButton.js";

export default {
name: "ChallengeTabHeader",
components: {
PrimaryButton,
PrimaryToggleButton
},
data() {
return {
retryChallenge: false,
isInChallenge: false,
isShowAllVisible: false,
isAutoECVisible: false,
showAllChallenges: false,
autoEC: false,
};
},
watch: {
retryChallenge(newValue) {
player.options.retryChallenge = newValue;
},
autoEC(newValue) {
player.reality.autoEC = newValue;
},
showAllChallenges(newValue) {
player.options.showAllChallenges = newValue;
},
},
methods: {
update() {
this.retryChallenge = player.options.retryChallenge;
this.showAllChallenges = player.options.showAllChallenges;
this.isInChallenge = Player.isInAnyChallenge;
this.isShowAllVisible = PlayerProgress.eternityUnlocked();
this.isAutoECVisible = Perk.autocompleteEC1.canBeApplied;
this.autoEC = player.reality.autoEC;
},
restartChallenge() {
const current = Player.anyChallenge;
if (Player.isInAnyChallenge) {
current.exit();
current.start();
}
},
exitChallenge() {
const current = Player.anyChallenge;
if (Player.isInAnyChallenge) {
current.exit();
}
},
},
template: `<div class="l-challenges-tab__header">
<div class="c-subtab-option-container">
<PrimaryToggleButton
v-model="retryChallenge"
label="Automatically retry challenges:"
class="o-challenge-header-btn"
/>
<PrimaryButton
v-if="isInChallenge"
@click="exitChallenge"
class="o-challenge-header-btn"
>
Exit Challenge
</PrimaryButton>
<PrimaryToggleButton
v-if="isShowAllVisible"
v-model="showAllChallenges"
label="Show all known challenges:"
class="o-challenge-header-btn"
/>
<PrimaryButton
v-if="isInChallenge"
@click="restartChallenge"
class="o-challenge-header-btn"
>
Restart Challenge
</PrimaryButton>
<PrimaryToggleButton
v-if="isAutoECVisible"
v-model="autoEC"
label="Auto Eternity Challenges:"
class="o-challenge-header-btn"
/>
</div>
</div>`
}