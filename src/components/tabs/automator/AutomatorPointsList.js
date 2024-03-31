export
default {
  name: "AutomatorPointsList",
  data() {
    return {
      totalPoints: 0,
    };
  },
  computed: {
    pointsForAutomator: () => AutomatorPoints.pointsForAutomator,
    fromPerks: () => AutomatorPoints.pointsFromPerks,
    fromUpgrades: () => AutomatorPoints.pointsFromUpgrades,
    perkSources: () => AutomatorPoints.perks,
    upgradeSources: () => AutomatorPoints.upgrades,
    otherSources: () => GameDatabase.reality.automator.otherAutomatorPoints,
    automatorInterval: () => AutomatorBackend.currentInterval,
  },
  methods: {
    update() {
      this.totalPoints = AutomatorPoints.totalPoints;
    },
    textColor(hasBought) {
      return {
        color: hasBought ? "var(--color-good)" : "var(--color-bad)"
      };
    }
  },
  template: `
  <div>
    <div class="l-header">
      You have {{ formatInt(totalPoints) }} / {{ formatInt(pointsForAutomator) }}
      Automator Points towards unlocking the Automator.
      <br>
      You gain Automator Points from the following sources:
    </div>
    <div class="l-automator-points-list-container">
      <div class="l-automator-points-list-side-col c-automator-points-list-col">
        <span class="c-automator-points-list-symbol fas fa-project-diagram" />
        <span class="c-automator-points-list-ap--large">{{ formatInt(fromPerks) }} AP</span>
        <span class="l-large-text">
          Perks
        </span>
        <div
          v-for="perk in perkSources"
          :key="perk.id"
          class="c-automator-points-list-single-entry"
          :style="textColor(perk.isBought)"
        >
          <span class="c-automator-points-list-perk-label">{{ perk.label }}</span>
          - {{ perk.shortDescription }}
          <span class="c-automator-points-list-ap">{{ formatInt(perk.automatorPoints) }} AP</span>
        </div>
      </div>
      <div class="l-automator-points-list-side-col c-automator-points-list-col">
        <span class="c-automator-points-list-symbol fas fa-arrow-up" />
        <span class="c-automator-points-list-ap--large">{{ formatInt(fromUpgrades) }} AP</span>
        <span class="l-large-text">
          Reality Upgrades
        </span>
        <div
          v-for="upgrade in upgradeSources"
          :key="upgrade.id"
          class="c-automator-points-list-single-entry l-upgrade-list"
          :style="textColor(upgrade.isBought)"
        >
          <b>{{ upgrade.name }}</b>
          <span class="c-automator-points-list-ap">{{ formatInt(upgrade.automatorPoints) }} AP</span>
          <br>
          {{ upgrade.shortDescription }}
        </div>
      </div>
    </div>
    <br>
    <div>
      The Automator allows (amongst other things) buying full Time Study Trees, entering Eternity Challenges,
      or starting Dilation.
      <br>
      It can also force prestige events on certain conditions independently from your Autobuyers or modify
      some of your Autobuyer settings.
      <br>
      The speed of the Automator gradually increases as you get more Realities. If unlocked right now,
      it would run {{ format(1000 / automatorInterval, 2, 2) }} commands per real-time second.
    </div>
  </div>
  `
}