import PrimaryButton from "../../PrimaryButton.js";
import PrimaryToggleButton from "../../PrimaryToggleButton.js";

export default {
  name: "AutobuyerToggles",
  components: {
    PrimaryButton,
    PrimaryToggleButton
  },
  data() {
    return {
      isDoomed: false,
      autobuyersOn: false,
      showContinuum: false,
      disableContinuum: false,
      allAutobuyersDisabled: false,
      allUntil10: false
    };
  },
  watch: {
    autobuyersOn(newValue) {
      player.auto.autobuyersOn = newValue;
    },
    disableContinuum(newValue) {
      if (ImaginaryUpgrade(21)
        .isLockingMechanics && !newValue) {
        ImaginaryUpgrade(21)
          .tryShowWarningModal();
        return;
      }
      Laitela.setContinuum(!newValue);
    }
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.autobuyersOn = player.auto.autobuyersOn;
      this.showContinuum = Laitela.isUnlocked;
      this.disableContinuum = player.auto.disableContinuum;
      this.allAutobuyersDisabled = Autobuyers.unlocked.every(autobuyer => !autobuyer.isActive);
      this.allUntil10 = Autobuyer.antimatterDimension.zeroIndexed.every(autobuyer => autobuyer.mode === AUTOBUYER_MODE.BUY_10 || !autobuyer.isUnlocked);
    },
    toggleAllAutobuyers() {
      for (const autobuyer of Autobuyers.unlocked) {
        autobuyer.isActive = this.allAutobuyersDisabled;
      }
    },
    toggleUntil10() {
      for (const autobuyer of Autobuyer.antimatterDimension.zeroIndexed) {
        if ((autobuyer.isUnlocked && autobuyer.mode === AUTOBUYER_MODE.BUY_10) === this.allUntil10) {
          autobuyer.toggleMode();
        }
      }
    }
  },
  template: `
    <div class="c-autobuyer-toggle-row">
      <PrimaryToggleButton
      v-model="autobuyersOn"
      on="Pause autobuyers"
      off="Resume autobuyers"
      class="o-flex__autobuyer"
      />
      <PrimaryButton
      @click="toggleAllAutobuyers()"
      class="o-flex__autobuyer"
      >
        {{ allAutobuyersDisabled ? "Enable" : "Disable" }} all autobuyers
      </PrimaryButton>
      <span v-if="isDoomed">
        <PrimaryButton
        v-if="showContinuum"
        class="o-flex__autobuyer"
        >
          Continuum is disabled
        </PrimaryButton>
      </span>
      <span v-else-if="showContinuum">
        <PrimaryToggleButton
        v-model="disableContinuum"
        class="o-flex__autobuyer"
        on="Enable Continuum"
        off="Disable Continuum"
        />
      </span>
      <span v-else>
        <PrimaryButton
        @click="toggleUntil10"
        class="o-flex__autobuyer"
        :enabled="allUntil10"
        >
          Toggle buy Until 10
        </PrimaryButton>
      </span>
    </div>
  `
}