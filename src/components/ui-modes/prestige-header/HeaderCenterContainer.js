import RealityCurrencyHeader from "../../RealityCurrencyHeader.js";

// This component contains antimatter and antimatter rate at the start of the game, as well as some additional
// information depending on the UI (tickspeed for Classic, game speed for Modern). Everything but antimatter is
// removed once Reality is unlocked, to make room for the reality button
export
default {
  name: "HeaderCenterContainer",
  components: {
    RealityCurrencyHeader
  },
  data() {
    return {
      shouldDisplay: true,
      hasRealityButton: false,
      isDoomed: false,
      antimatter: new Decimal(0),
      infinityPoints: new Decimal(0),
      eternityPoints: new Decimal(0),
      infUnlocked: false,
      eterUnlocked: false
    };
  },
  methods: {
    update() {
      this.shouldDisplay = player.break || !Player.canCrunch;
      if (!this.shouldDisplay) return;
      this.isDoomed = Pelle.isDoomed;
      this.antimatter.copyFrom(Currency.antimatter);
      this.infinityPoints.copyFrom(Currency.infinityPoints);
      this.eternityPoints.copyFrom(Currency.eternityPoints);
      const progress = PlayerProgress.current;
      this.infUnlocked = progress.isInfinityUnlocked;
      this.eterUnlocked = progress.isEternityUnlocked;
      this.hasRealityButton = progress.isRealityUnlocked || TimeStudy.reality.isBought;
      this.realityUnlocked = progress.isRealityUnlocked;
    },
  },
  template: `
  <div
    v-if="shouldDisplay"
    class="c-prestige-button-container"
  >
    <RealityCurrencyHeader v-if="realityUnlocked" />
    <div class="c-header-currency-info" v-if="eterUnlocked">
      You have
      <span class="c-game-header--currency c-game-header__ep-amount">
        {{ format(eternityPoints, 2, 1) }}
      </span>
      {{ pluralize("Eternity Point", eternityPoints) }}.
    </div>
    <div class="c-header-currency-info" v-if="infUnlocked">
      You have
      <span class="c-game-header--currency c-game-header__ip-amount">
        {{ format(infinityPoints, 2) }}
      </span>
      {{ pluralize("Infinity Point", infinityPoints) }}.
    </div>
    <div class="c-header-currency-info">
      You have
      <span class="c-game-header--currency c-game-header__antimatter">
        {{ format(antimatter, 2, 1) }}
      </span>
      antimatter.
    </div>
  </div>
  `
}