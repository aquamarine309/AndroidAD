import GameSpeedDisplay from "../../GameSpeedDisplay.js";
import HeaderChallengeEffects from "../../ui-modes/HeaderChallengeEffects.js";

export default {
  name: "TickspeedRow",
  components: {
    GameSpeedDisplay,
    HeaderChallengeEffects
  },
  data() {
    return {
      purchasedTickspeed: 0,
      freeTickspeed: 0,
      isVisible: false,
      mult: new Decimal(0),
      cost: new Decimal(0),
      isAffordable: false,
      tickspeed: new Decimal(0),
      gameSpeedMult: 1,
      galaxyCount: 0,
      isContinuumActive: false,
      continuumValue: 0,
      hasRealityButton: false,
      isEC9: false,
      realityUnlocked: false
    };
  },
  computed: {
    classObject() {
      return {
        "l-tickspeed-container": true,
        "l-tickspeed-container--hidden": !this.isVisible
      };
    },
    multiplierDisplay() {
      if (InfinityChallenge(3)
        .isRunning) return `Multiply all Antimatter Dimensions by
${formatX(1.05 + this.galaxyCount * 0.005, 3, 3)}`;
      const tickmult = this.mult;
      return `Increase Tickspeed by ${formatX(tickmult.reciprocal(), 2, 3)}`;
    },
    tickspeedDisplay() {
      return `Tickspeed: ${format(this.tickspeed, 2, 3)} / sec`;
    },
    continuumString() {
      return formatFloat(this.continuumValue, 2);
    },
    upgradeCount() {
      const purchased = this.purchasedTickspeed;
      if (!this.freeTickspeed) return quantifyInt("Purchased Upgrade", purchased);
      if (purchased === 0 || this.isContinuumActive) return `${formatInt(this.freeTickspeed)} Free Upgrades`;
      return `${formatInt(purchased)} Purchased + ${formatInt(this.freeTickspeed)} Free`;
    }
  },
  methods: {
    update() {
      this.hasRealityButton = PlayerProgress.realityUnlocked() || TimeStudy.reality.isBought;
      this.purchasedTickspeed = player.totalTickBought;
      this.freeTickspeed = FreeTickspeed.amount;
      this.isEC9 = EternityChallenge(9)
        .isRunning;
      this.isVisible = Tickspeed.isUnlocked || this.isEC9;
      if (!this.isVisible) return;
      this.mult.copyFrom(Tickspeed.multiplier);
      this.cost.copyFrom(Tickspeed.cost);
      this.isAffordable = Tickspeed.isAvailableForPurchase && Tickspeed.isAffordable;
      this.tickspeed.copyFrom(Tickspeed.perSecond);
      this.gameSpeedMult = getGameSpeedupForDisplay();
      this.galaxyCount = player.galaxies;
      this.isContinuumActive = Laitela.continuumActive;
      this.realityUnlocked = PlayerProgress.seenAlteredSpeed();
      if (this.isContinuumActive) this.continuumValue = Tickspeed.continuumValue;
    },
    buttonClass() {
      return {
        "o-primary-btn": true,
        "tickspeed-btn": true,
        "o-primary-btn--disabled": !this.isAffordable && !this.isContinuumActive,
        "o-non-clickable o-continuum": this.isContinuumActive
      };
    },
  },
  template: `<div :class="classObject">
<div class="tickspeed-labels c-dim-info-text--ad">
{{ multiplierDisplay }}
</div>
<div class="tickspeed-buttons">
<button
:class="buttonClass()"
onclick="buyTickSpeed()"
>
<span v-if="isContinuumActive">
Tickspeed Continuum: {{ continuumString }}
</span>
<span v-else-if="isEC9">
Tickspeed Unpurchasable (EC 9)
</span>
<span v-else>
Cost: {{ format(cost) }}
</span>
</button>
<button
v-if="!isContinuumActive"
class="o-primary-btn tickspeed-max-btn"
:class="{ 'o-primary-btn--disabled': !isAffordable && !isContinuumActive }"
onclick="buyMaxTickSpeed()"
>
Buy Max
</button>
</div>
<div
class="tickspeed-labels c-dim-info-text--ad"
>
{{ tickspeedDisplay }}
<br>
<GameSpeedDisplay />
</div>
<HeaderChallengeEffects />
</div>`
}