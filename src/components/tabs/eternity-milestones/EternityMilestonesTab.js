import EternityMilestoneButton from "./EternityMilestoneButton.js";

export default {
  name: "EternityMilestonesTab",
  components: {
    EternityMilestoneButton
  },
  data() {
    return {
      eternityCount: new Decimal(),
    };
  },
  computed: {
    milestones() {
      return Object.values(GameDatabase.eternity.milestones)
        .sort((a, b) => a.eternities - b.eternities)
        .map(config => new EternityMilestoneState(config));
    },
    rows() {
      return Math.ceil(this.milestones.length / 2);
    }
  },
  methods: {
    update() {
      this.eternityCount.copyFrom(Currency.eternities.value.floor());
    },
    getMilestone(row, column) {
      return () => this.milestones[(row - 1) * 2 + column - 1];
    }
  },
  template: `
  <div class="l-eternity-milestone-grid">
    <div>You have {{ quantify("Eternity", eternityCount, 3) }}.</div>
    <div>
      Offline generation milestones are only active under certain conditions, mouse-over to see these conditions.
    </div>
    <div
      v-for="row in rows"
      :key="row"
      class="l-eternity-milestone-grid__row"
    >
      <EternityMilestoneButton
        v-for="column in 2"
        :key="row * 2 + column"
        v-if="(row - 1) * 2 + column - 1 < milestones.length"
        :get-milestone="getMilestone(row, column)"
        class="l-eternity-milestone-grid__cell"
      />
    </div>
  </div>
  `
}