import CostDisplay from "../../CostDisplay.js";
import DescriptionDisplay from "../../DescriptionDisplay.js";
import EffectDisplay from "../../EffectDisplay.js";
import HintText from "../../HintText.js";
import PrimaryToggleButton from "../../PrimaryToggleButton.js";

export
default {
  name: "RealityUpgradeButton",
  components: {
    PrimaryToggleButton,
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay,
    HintText
  },
  props: {
    upgrade: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isAvailableForPurchase: false,
      automatorPoints: false,
      canBeBought: false,
      isRebuyable: false,
      isBought: false,
      isPossible: false,
      isAutoUnlocked: false,
      isAutobuyerOn: false,
      canBeLocked: false,
      hasRequirementLock: false,
      lastClick: Date.now()
    };
  },
  computed: {
    config() {
      return this.upgrade.config;
    },
    classObject() {
      return {
        "c-reality-upgrade-btn--useless": this.isUseless,
        "c-reality-upgrade-btn--bought": this.isBought && !this.isUseless,
        "c-reality-upgrade-btn--unavailable": !this.isBought && !this.canBeBought && this.isAvailableForPurchase,
        "c-reality-upgrade-btn--possible": !this.isAvailableForPurchase && this.isPossible,
        "c-reality-upgrade-btn--locked": !this.isAvailableForPurchase && !this.isPossible,
      };
    },
    requirementConfig() {
      return {
        description: this.config.requirement
      };
    },
    canLock() {
      return this.config.canLock && !(this.isAvailableForPurchase || this.isBought);
    },
    isUseless() {
      return Pelle.disabledRUPGs.includes(this.upgrade.id) && Pelle.isDoomed;
    },
  },
  watch: {
    isAutobuyerOn(newValue) {
      Autobuyer.realityUpgrade(this.upgrade.id)
        .isActive = newValue;
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isAvailableForPurchase = upgrade.isAvailableForPurchase;
      this.automatorPoints = this.config.automatorPoints;
      this.canBeBought = upgrade.canBeBought;
      this.isRebuyable = upgrade.isRebuyable;
      this.isBought = !upgrade.isRebuyable && upgrade.isBought;
      this.isPossible = upgrade.isPossible;
      this.isAutoUnlocked = Ra.unlocks.instantECAndRealityUpgradeAutobuyers.canBeApplied;
      this.canBeLocked = upgrade.config.canLock && !this.isAvailableForPurchase;
      this.hasRequirementLock = upgrade.hasPlayerLock;
      if (this.isRebuyable) this.isAutobuyerOn = Autobuyer.realityUpgrade(upgrade.id)
        .isActive;
    },
    toggleLock(upgrade) {
      if (this.isRebuyable) return;
      upgrade.toggleMechanicLock();
    },
    handleClick() {
      const now = Date.now();
      if (now - this.lastClick < 600) {
        clearTimeout(this.timeout);
        this.toggleLock(this.upgrade);
        this.lastClick = 0;
      } else {
        this.timeout = setTimeout(() => {
          this.upgrade.purchase();
          console.log("clicked");
          this.lastClick = now;
        }, 600)
      }
    }
  },
  template: `<div class="l-spoon-btn-group">
    <button
      :class="classObject"
      class="l-reality-upgrade-btn c-reality-upgrade-btn"
      @click.exact="handleClick"
    >
      <HintText
        type="realityUpgrades"
        class="l-hint-text--reality-upgrade c-hint-text--reality-upgrade"
      >
        {{ config.name }}
      </HintText>
      <span :class="{ 'o-pelle-disabled': isUseless }">
        <DescriptionDisplay :config="config" />
        <template v-if="($viewModel.shiftDown === isAvailableForPurchase) && !isRebuyable">
          <br>
          <DescriptionDisplay
            :config="requirementConfig"
            label="Requirement:"
            class="c-reality-upgrade-btn__requirement"
          />
        </template>
        <template v-else>
          <EffectDisplay
            :config="config"
            br
          />
          <CostDisplay
            v-if="!isBought"
            :config="config"
            br
            name="Reality Machine"
          />
        </template>
        <b v-if="automatorPoints && !isBought">
          (+{{ formatInt(automatorPoints) }} AP)
        </b>
      </span>
    </button>
    <div
      v-if="canBeLocked"
      class="o-requirement-lock"
    >
      <i
        v-if="hasRequirementLock"
        class="fas fa-lock"
      />
      <i
        v-else-if="canLock"
        class="fas fa-lock-open"
      />
    </div>
    <PrimaryToggleButton
      v-if="isRebuyable && isAutoUnlocked"
      v-model="isAutobuyerOn"
      label="Auto:"
      class="o-primary-btn--reality-upgrade-toggle"
    />
  </div>
  `
}