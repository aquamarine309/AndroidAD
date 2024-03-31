import AntimatterDimensionProgressBar from "./AntimatterDimensionProgressBar.js";
import AntimatterDimensionRow from "../../tabs/antimatter-dimensions/AntimatterDimensionRow.js";
import AntimatterGalaxyRow from "../../tabs/antimatter-dimensions/AntimatterGalaxyRow.js";
import DimensionBoostRow from "../../tabs/antimatter-dimensions/DimensionBoostRow.js";
import PrimaryButton from "../../PrimaryButton.js";
import TickspeedRow from "../../tabs/antimatter-dimensions/TickspeedRow.js";

export default {
  name: "AntimatterDimensionsTab",
  components: {
    PrimaryButton,
    AntimatterDimensionProgressBar,
    AntimatterDimensionRow,
    AntimatterGalaxyRow,
    DimensionBoostRow,
    TickspeedRow
  },
  data() {
    return {
      hasDimensionBoosts: false,
      buyUntil10: true,
      isSacrificeUnlocked: false,
      isSacrificeAffordable: false,
      buy10Mult: new Decimal(0),
      currentSacrifice: new Decimal(0),
      sacrificeBoost: new Decimal(0),
      disabledCondition: "",
      isQuickResetAvailable: false,
      hasContinuum: false,
      isContinuumActive: false,
      multiplierText: "",
      antimatterPerSec: new Decimal(0)
    };
  },
  methods: {
    maxAll() {
      maxAll();
    },
    sacrifice() {
      sacrificeBtnClick();
    },
    // Toggle single/10 without Continuum, otherwise cycle through all 3 if it's unlocked
    changeBuyMode() {
      if (!this.hasContinuum) {
        player.buyUntil10 = !player.buyUntil10;
        return;
      }
      // "Continuum" => "Until 10" => "Buy 1" => "Continuum"
      if (this.isContinuumActive) {
        Laitela.setContinuum(false);
        player.buyUntil10 = true;
      } else if (player.buyUntil10) {
        player.buyUntil10 = false;
      } else {
        if (ImaginaryUpgrade(21)
          .isLockingMechanics && player.auto.disableContinuum) {
          ImaginaryUpgrade(21)
            .tryShowWarningModal();
          return;
        }
        Laitela.setContinuum(true);
      }
    },
    getUntil10Display() {
      if (this.isContinuumActive) return "Continuum";
      return this.buyUntil10 ? "Until 10" : "Buy 1";
    },
    update() {
      this.hasDimensionBoosts = player.dimensionBoosts > 0;
      this.buyUntil10 = player.buyUntil10;
      this.hasContinuum = Laitela.continuumUnlocked;
      this.isContinuumActive = Laitela.continuumActive;
      this.isQuickResetAvailable = Player.isInAntimatterChallenge && Player.antimatterChallenge.isQuickResettable;

      const isSacrificeUnlocked = Sacrifice.isVisible;
      this.isSacrificeUnlocked = isSacrificeUnlocked;

      this.buy10Mult.copyFrom(AntimatterDimensions.buyTenMultiplier);

      this.multiplierText = `Buy ten multiplier: ${formatX(this.buy10Mult, 2, 2)}`;
      this.antimatterPerSec.copyFrom(Currency.antimatter.productionPerSecond);
      if (!isSacrificeUnlocked) return;
      this.isSacrificeAffordable = Sacrifice.canSacrifice;
      this.currentSacrifice.copyFrom(Sacrifice.totalBoost);
      this.sacrificeBoost.copyFrom(Sacrifice.nextBoost);
      this.disabledCondition = Sacrifice.disabledCondition;
      const sacText = this.isSacrificeUnlocked ? ` | Sacrifice multiplier: ${formatX(this.currentSacrifice, 2, 2)}` : "";
      this.multiplierText += sacText;
    }
  },
  template: `
  <div class="l-antimatter-dim-tab">
	<div class="c-dim-info-text--ad">You are getting {{ format(antimatterPerSec, 2, 1) }} antimatter per second.</div>
	<TickspeedRow />
	<div class="modes-container">
		<PrimaryButton v-show="isSacrificeUnlocked"
		:enabled="isSacrificeAffordable"
		class="o-primary-btn--sacrifice"
		@click="sacrifice">
			<span v-if="isSacrificeAffordable">Dimensional Sacrifice ({{ formatX(sacrificeBoost, 2, 2) }})</span>
			<span v-else>Sacrifice disabled ({{ disabledCondition }})</span>
		</PrimaryButton>
	</div>
	<span class="c-dim-info-text--ad">{{ multiplierText }}</span>
	<div class="l-dimensions-container">
		<AntimatterDimensionRow v-for="tier in 8"
		:key="tier"
	  :tier="tier" />
	</div>
	<div class="quick-reset-conatiner">
		<PrimaryButton v-if="isQuickResetAvailable"
	  class="o-primary-btn--quick-reset"
		onclick="softReset(-1, true, true)">
			Perform a Dimension Boost reset
			<span v-if="hasDimensionBoosts"> but lose a Dimension Boost</span>
			<span v-else> for no gain</span>
		</PrimaryButton>
	</div>
	<div class="resets-container">
		<DimensionBoostRow />
		<AntimatterGalaxyRow />
	</div>
	<AntimatterDimensionProgressBar />
</div>
  `
}