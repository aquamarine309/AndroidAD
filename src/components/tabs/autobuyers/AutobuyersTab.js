import AutobuyerToggles from "./AutobuyerToggles.js";
import BigCrunchAutobuyerBox from "./BigCrunchAutobuyerBox.js";
import DimensionAutobuyerBox from "./DimensionAutobuyerBox.js";
import DimensionBoostAutobuyerBox from "./DimensionBoostAutobuyerBox.js";
import EternityAutobuyerBox from "./EternityAutobuyerBox.js";
import GalaxyAutobuyerBox from "./GalaxyAutobuyerBox.js";
import OpenModalHotkeysButton from "../../OpenModalHotkeysButton.js";
import RealityAutobuyerBox from "./RealityAutobuyerBox.js";
import SimpleAutobuyersMultiBox from "./SimpleAutobuyersMultiBox.js";
import TickspeedAutobuyerBox from "./TickspeedAutobuyerBox.js";

export default {
name: "AutobuyersTab",
components: {
AutobuyerToggles,
OpenModalHotkeysButton,
RealityAutobuyerBox,
EternityAutobuyerBox,
BigCrunchAutobuyerBox,
GalaxyAutobuyerBox,
DimensionBoostAutobuyerBox,
TickspeedAutobuyerBox,
DimensionAutobuyerBox,
SimpleAutobuyersMultiBox
},
data() {
return {
hasInfinity: false,
hasContinuum: false,
displayADAutobuyersIndividually: false,
hasInstant: false,
};
},
computed: {
// It only makes sense to show this if the player has seen gamespeed-altering effects, but we should keep it there
// permanently as soon as they have
hasSeenGamespeedAlteringEffects() {
return PlayerProgress.seenAlteredSpeed();
},
gameTickLength() {
return `${formatInt(player.options.updateRate)} ms`;
}
},
methods: {
update() {
this.hasInfinity = PlayerProgress.infinityUnlocked();
this.hasContinuum = Laitela.continuumActive;
this.checkADAutoStatus();
},
checkADAutoStatus() {
const ad = Autobuyer.antimatterDimension;
// Since you don't need to buy autobuyers in Doomed and unbought ones are hidden, we can check if only the
// autobuyers you can see (ie, have unlocked) have been maxed.
if (Pelle.isDoomed) {
this.displayADAutobuyersIndividually = !ad.zeroIndexed.filter(x => x.isUnlocked)
.every(x => x.hasUnlimitedBulk && x.hasMaxedInterval);
return;
}
this.hasInstant = ad.hasInstant;
this.displayADAutobuyersIndividually = !ad.collapseDisplay;
},
},
template: `<div class="l-autobuyers-tab">
<AutobuyerToggles />
<div v-if="hasSeenGamespeedAlteringEffects" class="c-info-color">
Autobuyer intervals and time-based settings are always <b>real time</b> and therefore
<br>
unaffected by anything which may alter how fast the game itself is running.
<br>
<br>
</div>
<div v-if="!hasInfinity" class="c-info-color">
Challenges for upgrading autobuyers are unlocked by reaching Infinity.
</div>
<b class="c-info-color">Autobuyers with no displayed bulk have unlimited bulk by default.</b>
<b class="c-info-color">
Antimatter Dimension Autobuyers can have their bulk upgraded once interval is below {{ formatInt(100) }} ms.
</b>
<b v-if="hasInstant" class="c-info-color">Autobuyers with "Instant" interval will trigger every game tick ({{ gameTickLength }}).</b>
<div class="c-autobuyer-row">
<RealityAutobuyerBox class="c-reality-pos" />
<EternityAutobuyerBox class="c-eternity-pos" />
</div>
<div class="c-autobuyer-row">
<BigCrunchAutobuyerBox class="c-infinity-pos" />
<DimensionBoostAutobuyerBox />
</div>
<div class="c-autobuyer-row">
<GalaxyAutobuyerBox />
<TickspeedAutobuyerBox v-if="!hasContinuum" />
</div>
<template v-if="displayADAutobuyersIndividually">
<div
class="c-autobuyer-row"
v-for="row in 4"
:key="row"
>
  <DimensionAutobuyerBox
  v-for="column in 2"
  :key="column"
  :tier="(row - 1) * 2 + column"
  />
</div>
</template>
<SimpleAutobuyersMultiBox />
</div>`
}