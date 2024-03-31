import PrimaryButton from "../../PrimaryButton.js";
import PrimaryToggleButton from "../../PrimaryToggleButton.js";

export default {
  name: "EPMultiplierButton",
  components: {
    PrimaryButton,
    PrimaryToggleButton
  },
  data() {
    return {
      isAutobuyerActive: false,
      isAutoUnlocked: false,
      isAffordable: false,
      multiplier: new Decimal(),
      cost: new Decimal()
    };
  },
  computed: {
    upgrade() {
      return EternityUpgrade.epMult;
    },
    autobuyer() {
      return Autobuyer.epMult;
    },
    classObject() {
      if (this.isDoomed) {
        return {
          "o-eternity-upgrade": true,
          "c-ep-mult-btn": true,
          "o-eternity-upgrade--useless": !this.isAffordable,
          "o-pelle-disabled-pointer": true,
          "o-pelle-disabled": true,
        };
      }
      return {
        "o-eternity-upgrade": true,
        "c-ep-mult-btn": true,
        "o-eternity-upgrade--available": this.isAffordable,
        "o-eternity-upgrade--unavailable": !this.isAffordable
      };
    },
    isDoomed: () => Pelle.isDoomed,
  },
  watch: {
    isAutobuyerActive(newValue) {
      Autobuyer.epMult.isActive = newValue;
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isAutoUnlocked = this.autobuyer.isUnlocked;
      this.isAutobuyerActive = this.autobuyer.isActive;
      this.multiplier.copyFrom(upgrade.effectValue);
      this.cost.copyFrom(upgrade.cost);
      this.isAffordable = upgrade.isAffordable;
    },
    purchaseUpgrade() {
      if (RealityUpgrade(15)
        .isLockingMechanics) RealityUpgrade(15)
        .tryShowWarningModal();
      else this.upgrade.purchase();
    }
  },
  template: `
  <div class="l-ep-mult-conatiner">
    <PrimaryButton
      class="o-primary-btn--ep-mult"
      @click="upgrade.buyMax(false)"
    >
      Max Eternity Point mult
    </PrimaryButton>
    <PrimaryToggleButton
      v-if="isAutoUnlocked"
      v-model="isAutobuyerActive"
      label="Autobuy EP mult"
      class="o-primary-btn--ep-mult"
    />
    <button
      :class="classObject"
      @click="purchaseUpgrade"
    >
      <div :class="{ 'o-pelle-disabled': isDoomed }">
        You gain {{ formatX(5) }} times more EP
        <br>
        Currently: {{ formatX(multiplier, 2, 0) }}
      </div>
      Cost: {{ format(cost, 2, 0) }} EP
    </button>
  </div>
  `
}