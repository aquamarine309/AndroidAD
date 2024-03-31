import ArmageddonButton from "./ArmageddonButton.js";
import PelleUpgradeVue from "./PelleUpgrade.js";
import RemnantGainFactor from "./RemnantGainFactor.js";

export default {
name: "PelleUpgradePanel",
components: {
ArmageddonButton,
PelleUpgradeVue,
RemnantGainFactor,
},
data() {
return {
showBought: false,
isCollapsed: false,
isHovering: false,
remnants: 0,
realityShards: new Decimal(0),
shardRate: new Decimal(0),
upgrades: [],
boughtUpgrades: []
};
},
computed: {
collapseIcon() {
return this.isCollapsed
? "fas fa-expand-arrows-alt"
: "fas fa-compress-arrows-alt";
},
rebuyables: () => PelleUpgrade.rebuyables,
visibleUpgrades() { return this.upgrades.slice(0, 5); },
fadedUpgrades() { return this.upgrades.slice(5, 10); },
allUpgrades() {
let upgrades = [];
if (this.showBought) upgrades = this.boughtUpgrades;
upgrades = upgrades.concat(this.visibleUpgrades);
return upgrades;
},
showImprovedEstimate() {
return this.isHovering && !this.shardRate.eq(0);
}
},
methods: {
update() {
this.showBought = Pelle.cel.showBought;
this.isCollapsed = player.celestials.pelle.collapsed.upgrades;
this.remnants = Pelle.cel.remnants;
this.realityShards.copyFrom(Pelle.cel.realityShards);
this.shardRate.copyFrom(Pelle.realityShardGainPerSecond);
this.upgrades = PelleUpgrade.singles.filter(u => !u.isBought);
this.boughtUpgrades = PelleUpgrade.singles.filter(u => u.isBought);
},
toggleBought() {
Pelle.cel.showBought = !Pelle.cel.showBought;
this.$recompute("upgrades");
},
toggleCollapse() {
player.celestials.pelle.collapsed.upgrades = !this.isCollapsed;
}
},
template: `<div class="l-pelle-panel-container">
<div class="c-pelle-panel-title">
<i
:class="collapseIcon"
class="c-collapse-icon-clickable"
@click="toggleCollapse"
/>
Pelle Upgrades
</div>
<div
v-if="!isCollapsed"
class="l-pelle-content-container"
>
<div class="c-armageddon-container">
<div>
<div
class="c-armageddon-button-container"
@mouseover="isHovering = true"
@mouseleave="isHovering = false"
>
<ArmageddonButton />
</div>
<RemnantGainFactor :hide="showImprovedEstimate" />
</div>
<div class="c-armageddon-resources-container">
<div>
You have <span class="c-remnants-amount">{{ format(remnants, 2) }}</span> Remnants.
</div>
<div>
You have <span class="c-remnants-amount">{{ format(realityShards, 2) }}</span> Reality Shards.
<span class="c-remnants-amount">+{{ format(shardRate, 2, 2) }}/s</span>
</div>
</div>
</div>
<div class="c-pelle-upgrade-container">
<PelleUpgradeVue
v-for="upgrade in rebuyables"
:key="upgrade.config.id"
:upgrade="upgrade"
:show-improved-estimate="showImprovedEstimate"
/>
</div>
<button
class="o-pelle-button"
@click="toggleBought"
>
{{ showBought ? "Showing bought upgrades" : "Bought upgrades hidden" }}
</button>
<div
v-if="allUpgrades.length"
class="c-pelle-upgrade-container"
>
<PelleUpgradeVue
v-for="upgrade in allUpgrades"
:key="upgrade.config.id"
:upgrade="upgrade"
:show-improved-estimate="showImprovedEstimate"
/>
<PelleUpgradeVue
v-for="upgrade in fadedUpgrades"
:key="upgrade.config.id"
:upgrade="upgrade"
faded
/>
</div>
<div v-else>
No upgrades to show!
</div>
</div>
</div>`
}
