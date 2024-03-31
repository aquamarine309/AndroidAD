import HeaderBlackHole from "./HeaderBlackHole.js";
import HeaderChallengeDisplay from "./HeaderChallengeDisplay.js";
import HeaderPrestigeGroup from "./HeaderPrestigeGroup.js";
import ArmageddonButton from "../tabs/celestial-pelle/ArmageddonButton.js";
import HeaderInfinityContainer from "./prestige-header/HeaderInfinityContainer.js";
import HeaderEternityContainer from "./prestige-header/HeaderEternityContainer.js";
import RealityButton from "./prestige-header/RealityButton.js";
import GameSpeedDisplay from "../GameSpeedDisplay.js";

export default {
  name: "GameHeader",
  components: {
    HeaderChallengeDisplay,
    HeaderBlackHole,
    HeaderPrestigeGroup,
    GameSpeedDisplay,
    RealityButton,
    ArmageddonButton,
    HeaderInfinityContainer,
    HeaderEternityContainer
  },
  data() {
    return {
      challengeVisible: false,
      showInfinityEternityBtnRow: false,
      realityUnlocked: false,
      isDoomed: false
    };
  },
  methods: {
    update() {
      this.challengeVisible = !player.break && Player.canCrunch;
      this.showInfinityEternityBtnRow = player.break;
      this.realityUnlocked = PlayerProgress.realityUnlocked() || TimeStudy.reality.isBought;
      this.isDoomed = Pelle.isDoomed;
    },
  },
  template: `
  <div>
    <div
    class="l-header-prestige-button-container"
    v-if="realityUnlocked"
    >
      <ArmageddonButton v-if="isDoomed" />
      <RealityButton v-else />
    </div>
    <div
    class="l-header-prestige-button-container"
    v-if="showInfinityEternityBtnRow"
    >
      <HeaderEternityContainer />
      <HeaderInfinityContainer />
    </div>
    <HeaderBlackHole />
    <HeaderChallengeDisplay v-if="!challengeVisible" />
    <HeaderPrestigeGroup />
  </div>
`
}