import InfinityUpgradeButton from "../../InfinityUpgradeButton.js";
import IpMultiplierButton from "./IpMultiplierButton.js";
import PrimaryButton from "../../PrimaryButton.js";

export default {
name: "InfinityUpgradesTab",
components: {
PrimaryButton,
InfinityUpgradeButton,
IpMultiplierButton
},
data() {
return {
isUseless: false,
chargeUnlocked: false,
totalCharges: 0,
chargesUsed: 0,
disCharge: false,
ipMultSoftCap: 0,
ipMultHardCap: 0,
eternityUnlocked: false,
bottomRowUnlocked: false,
styleOfColumnBg: undefined
};
},
computed: {
grid() {
return [
[
InfinityUpgrade.totalTimeMult,
InfinityUpgrade.dim18mult,
InfinityUpgrade.dim36mult,
InfinityUpgrade.resetBoost
],
[
InfinityUpgrade.buy10Mult,
InfinityUpgrade.dim27mult,
InfinityUpgrade.dim45mult,
InfinityUpgrade.galaxyBoost
],
[
InfinityUpgrade.thisInfinityTimeMult,
InfinityUpgrade.unspentIPMult,
InfinityUpgrade.dimboostMult,
InfinityUpgrade.ipGen
],
[
InfinityUpgrade.skipReset1,
InfinityUpgrade.skipReset2,
InfinityUpgrade.skipReset3,
InfinityUpgrade.skipResetGalaxy
]
];
},
allColumnUpgrades() {
return this.grid.flat();
},
disChargeClassObject() {
return {
"o-primary-btn--subtab-option": true,
"o-primary-btn--charged-respec-active": this.disCharge
};
},
offlineIpUpgrade: () => InfinityUpgrade.ipOffline
},
watch: {
disCharge(newValue) {
player.celestials.ra.disCharge = newValue;
}
},
created() {
this.on$(GAME_EVENT.INFINITY_UPGRADE_BOUGHT, () => this.setStyleOfColumnBg());
this.on$(GAME_EVENT.INFINITY_UPGRADE_CHARGED, () => this.setStyleOfColumnBg());
this.on$(GAME_EVENT.INFINITY_UPGRADES_DISCHARGED, () => this.setStyleOfColumnBg());

this.setStyleOfColumnBg();
},
methods: {
update() {
this.isUseless = Pelle.isDoomed;
this.chargeUnlocked = Ra.unlocks.chargedInfinityUpgrades.canBeApplied && !Pelle.isDoomed;
this.totalCharges = Ra.totalCharges;
this.chargesUsed = Ra.totalCharges - Ra.chargesLeft;
this.disCharge = player.celestials.ra.disCharge;
this.ipMultSoftCap = GameDatabase.infinity.upgrades.ipMult.costIncreaseThreshold;
this.ipMultHardCap = GameDatabase.infinity.upgrades.ipMult.costCap;
this.eternityUnlocked = PlayerProgress.current.isEternityUnlocked;
this.bottomRowUnlocked = Achievement(41).isUnlocked;
},
btnClassObject(column) {
const classObject = {
"l-infinity-upgrade-grid__cell": true
};
if (column > 0) {
// Indexing starts from 0, while css classes start from 2 (and first column has default css class)
classObject[`o-infinity-upgrade-btn--color-${column + 1}`] = true;
}
return classObject;
},
getColumnColor(location) {
if (location.isCharged) return "var(--color-teresa--base)";
if (location.isBought) return "var(--color-infinity)";
return "transparent";
},
setStyleOfColumnBg() {
this.styleOfColumnBg = this.grid.map(col => ({
background:
`linear-gradient(to bottom,
${this.getColumnColor(col[0])} 15%,
${this.getColumnColor(col[1])} 35% 40%,
${this.getColumnColor(col[2])} 60% 65%,
${this.getColumnColor(col[3])} 85% 100%`
}));
},
},
template: `<div class="l-infinity-upgrades-tab">
<div
v-if="chargeUnlocked"
class="c-subtab-option-container"
>
<PrimaryButton
:class="disChargeClassObject"
@click="disCharge = !disCharge"
>
Respec Charged Infinity Upgrades on next Reality
</PrimaryButton>
</div>
<div v-if="chargeUnlocked" class="c-info-color">
You have charged {{ formatInt(chargesUsed) }}/{{ formatInt(totalCharges) }} Infinity Upgrades.
Charged Infinity Upgrades have their effect altered.
<br>
Hold shift to show Charged Infinity Upgrades. You can freely respec your choices on Reality.
</div>
<div v-if="isUseless" class="c-info-color">
You cannot Charge Infinity Upgrades while Doomed.
</div>
<div class="c-info-color">Within each column, the upgrades must be purchased from top to bottom.</div>
<div class="l-infinity-upgrade-all">
<div v-if="eternityUnlocked && bottomRowUnlocked" class="c-info-color">
The Infinity Point multiplier becomes more expensive
<br>
above {{ formatPostBreak(ipMultSoftCap) }} Infinity Points, and cannot be purchased past
{{ formatPostBreak(ipMultHardCap) }} Infinity Points.
</div>
<div
v-if="bottomRowUnlocked"
class="l-infinity-upgrades-bottom-row"
>
<IpMultiplierButton class="l-infinity-upgrades-tab__mult-btn" />
<InfinityUpgradeButton
:upgrade="offlineIpUpgrade"
:class="btnClassObject(1)"
class="l-infinity-upgrade--offline"
/>
</div>
<div
class="l-infinity-upgrade-grid l-infinity-upgrades-tab__grid"
v-for="row in 2"  
:key="row"
>
<div
v-for="column in grid.length / 2"
:key="column"
class="c-infinity-upgrade-grid__column"
>
<h4 class="c-infinity-upgrade-column-text">Column {{ (row - 1) * 2 + column }}</h4>
<InfinityUpgradeButton
v-for="index in 4"
:key="index"
:upgrade="grid[(row - 1) * 2 + column - 1][index - 1]"
:class="btnClassObject((row - 1) * 2 + column - 1)"
/>
</div>
</div>
</div>
</div>`
}
