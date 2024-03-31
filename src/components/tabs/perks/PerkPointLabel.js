import PrimaryButton from "../../PrimaryButton.js";

export default {
  name: "PerkPointLabel",
  components: {
    PrimaryButton
  },
  data() {
    return {
      pp: 0,
      treeLayout: 0,
      physicsEnabled: false,
      physicsOverride: false,
    };
  },
  computed: {
    layoutText() {
      return PerkLayouts[this.treeLayout].buttonText;
    },
    physicsText() {
      const enableStr = (this.physicsOverride ?? this.physicsEnabled) ? "Enabled" : "Disabled";
      return `${enableStr}${this.physicsOverride === undefined ? "" : " (fixed)"}`;
    }
  },
  created() {
    this.treeLayout = player.options.perkLayout;
    this.physicsOverride = PerkLayouts[this.treeLayout].forcePhysics;
  },
  methods: {
    update() {
      this.pp = Math.floor(Currency.perkPoints.value);
      this.physicsEnabled = player.options.perkPhysicsEnabled;
    },
    centerTree() {
      PerkNetwork.resetPosition(true);
    },
    straightenEdges() {
      PerkNetwork.setEdgeCurve(false);
      PerkNetwork.setEdgeCurve(true);
    },
  },
  template: `
  <div class="c-perk-tab__header c-info-color">
    You have <span class="c-perk-tab__perk-points">{{ format(pp, 2) }}</span> {{ pluralize("Perk Point", pp) }}.
    <br>
    Perk choices are permanent and cannot be respecced.
    <br>
    Diamond-shaped perks also give Automator Points.
    <br>
    <div class="perk-settings">
      <PrimaryButton
        class="o-primary-btn"
        @click="centerTree"
      >
        Center Tree on START
      </PrimaryButton>
      <PrimaryButton
        class="o-primary-btn"
        @click="straightenEdges"
      >
        Straighten Edges
      </PrimaryButton>
    </div>
  </div>
  `
}