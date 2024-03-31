import BigCrunchButton from "../BigCrunchButton.js";
import EternityPointsHeader from "../../EternityPointsHeader.js";
import InfinityPointsHeader from "../../InfinityPointsHeader.js";
import GameHeader from "../GameHeader.js";
import NewsTicker from "../NewsTicker.js";

export default {
	name: "AndroidUI",
	components: {
	  BigCrunchButton,
    GameHeader,
    NewsTicker,
    InfinityPointsHeader,
    EternityPointsHeader,
    BigCrunchButton
	},
	data() {
		return {
			bigCrunch: false,
      smallCrunch: false,
      newGameKey: "",
      isFullScreen: false
		}
	},
	computed: {
	  tab() {
	    return this.$viewModel.tab;
	  },
	  subtab() {
	    return this.$viewModel.subtab;
	  },
    news() {
      return this.$viewModel.news;
    }
	},
	methods: {
		update() {
			this.newGameKey = Pelle.isDoomed;
			const crunchButtonVisible = !player.break && Player.canCrunch;
      this.bigCrunch = crunchButtonVisible && Time.bestInfinityRealTime.totalMinutes > 1;
      //Game ui has padding, but it should not show in the achievements tab.
      this.isFullScreen = this.tab === "achievements" || this.subtab === "studies";
		}
	},
	template: `
		<div
		id="container"
    :key="newGameKey"
    class="container l-old-ui c-old-ui"
    :class="{'l-old-ui--achievement': isFullScreen}"
		>
      <BigCrunchButton />
      <template v-if="!bigCrunch">
        <GameHeader class="l-old-ui__header" />
        <div class="l-old-ui__page">
          <slot />
        </div>
      </template>
		</div>
	`
}