import BackgroundAnimations from "./BackgroundAnimations.js";
//import GameUiComponentFixed from "./GameUiComponentFixed.js"
//import TabComponents from "./tabs/index.js";
//import AndroidUI from "./ui-modes/android/AndroidUI.js";

export default {
  name: "GameUIComponent",
  components: {
    ...TabComponents,
    GameUiComponentFixed,
    BackgroundAnimations,
    AndroidUI
  },
	data() {
		return {
			isOverlay: false
		}
	}, 
  computed: {
    view() {
      return this.$viewModel;
    },
    page() {
      const subtab = Tabs.current[this.$viewModel.subtab];
      return subtab.config.component;
    },
    themeCss() {
      return `stylesheets/theme-${this.view.theme}.css`;
    },
    classObject() {
      return {
        "c-game-ui": true,
        "c-game-ui--hidden": this.isOverlay
      }
    }
  },
  methods: {
    handleClick() {
      EventHub.dispatch(GAME_EVENT.CLICK_SCREEN);
      ScreenOverlay.clear();
    },
    updateOverlay() {
      this.isOverlay = ScreenOverlay.show;
    }
  },
  created() {
    this.on$(GAME_EVENT.OVERLAY_UPDATE, this.updateOverlay);
  },
  template: `<div
    v-if="view.initialized"
    @touchstart="handleClick"
    id="ui-container"
    class="ui-wrapper"
  >
    <div
      id="ui"
      :class="classObject"
    >
      <AndroidUI>
        <component
          :is="page"
          class="c-game-tab"
        />
      </AndroidUI>
      </component>
      <link
        v-if="view.theme !== 'Normal'"
        type="text/css"
        rel="stylesheet"
        :href="themeCss"
      >
    </div>
    <GameUiComponentFixed />
    <BackgroundAnimations />
  </div>`
};
  