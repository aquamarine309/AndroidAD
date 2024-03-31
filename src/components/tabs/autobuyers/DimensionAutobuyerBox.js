import AutobuyerBox from "./AutobuyerBox.js";
import AutobuyerIntervalButton from "./AutobuyerIntervalButton.js";
import DimensionBulkButton from "./DimensionBulkButton.js";

export default {
  name: "DimensionAutobuyerBox",
  components: {
    DimensionBulkButton,
    AutobuyerBox,
    AutobuyerIntervalButton
  },
  props: {
    tier: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      mode: AUTOBUYER_MODE.BUY_SINGLE
    };
  },
  computed: {
    autobuyer() {
      return Autobuyer.antimatterDimension(this.tier);
    },
    name() {
      return `${AntimatterDimension(this.tier).shortDisplayName} Dimension Autobuyer`;
    },
    modeDisplay() {
      switch (this.mode) {
        case AUTOBUYER_MODE.BUY_SINGLE:
          return "Buys singles";
        case AUTOBUYER_MODE.BUY_10:
          return "Buys max";
      }
      throw "Unknown Dimension Autobuyer mode";
    }
  },
  methods: {
    update() {
      this.mode = this.autobuyer.mode;
    },
    toggleMode() {
      this.autobuyer.toggleMode();
      this.update();
    }
  },
  template: `
    <AutobuyerBox
    :autobuyer="autobuyer"
    :name="name"
    show-interval
    >
      <template #intervalSlot>
        <AutobuyerIntervalButton :autobuyer="autobuyer" />
        <DimensionBulkButton :autobuyer="autobuyer" />
      </template>
      <template #toggleSlot>
        <button
        class="o-autobuyer-btn"
        @click="toggleMode"
        >
          {{ modeDisplay }}
        </button>
      </template>
    </AutobuyerBox>
  `
}