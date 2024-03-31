import CelestialQuoteHistoryDisplay from "./modals/celestial-quotes/CelestialQuoteHistoryDisplay.js";
import CelestialQuoteModal from "./modals/celestial-quotes/CelestialQuoteModal.js";
import CreditsContainer from "./tabs/celestial-pelle/CreditsContainer.js";
import FadeAway from "./tabs/celestial-pelle/FadeAway.js";
import ModalProgressBar from "./modals/ModalProgressBar.js";
import NewGame from "./tabs/celestial-pelle/NewGame.js";
import PopupModal from "./modals/PopupModal.js";
import SpectateGame from "./SpectateGame.js";
import SpeedrunStatus from "./SpeedrunStatus.js";
import AndroidUIHeader from "./ui-modes/android/AndroidUIHeader.js";
import AndroidUIBottom from "./ui-modes/android/AndroidUIBottom.js";

export default {
  name: "GameUiComponentFixed",
  components: {
    AndroidUIHeader,
    AndroidUIBottom,
    SpeedrunStatus,
    PopupModal,
    ModalProgressBar,
    CelestialQuoteModal,
    CelestialQuoteHistoryDisplay,
    FadeAway,
    CreditsContainer,
    SpectateGame,
    NewGame
  },
  data() {
    return {
      ending: false,
      shouldOverlay: false
    };
  },
  computed: {
    view() {
      return this.$viewModel;
    },
    hideIfMatoFullscreen() {
      return {
        visibility: ui.view.tabs.reality.automator.fullScreen ? "hidden" : "visible"
      };
    }
  },
  methods: {
    update() {
      this.ending = GameEnd.endState >= END_STATE_MARKERS.FADE_AWAY && !GameEnd.creditsClosed;
    },
    updateOverlay() {
      this.shouldOverlay = ScreenOverlay.show;
    }
  },
  created() {
    this.on$(GAME_EVENT.OVERLAY_UPDATE, this.updateOverlay);
  },
  template: `
  <!-- Hide the button if the automator is in fullscreen mode: Nothing here needs to be visible during fullscreen -->
  <div
    id="ui-fixed"
    class="c-game-ui--fixed"
  >
    <AndroidUIHeader />
    <AndroidUIBottom />
    <SpeedrunStatus :style="hideIfMatoFullscreen" />
    <ModalProgressBar v-if="view.modal.progressBar" />
    <CelestialQuoteModal
      v-else-if="view.quotes.current"
      :quote="view.quotes.current"
    />
    <CelestialQuoteHistoryDisplay
      v-else-if="view.quotes.history"
      :quotes="view.quotes.history"
    />
    <PopupModal
      v-else-if="view.modal.current"
      :modal="view.modal.current"
    />
    <FadeAway v-if="ending" />
    <CreditsContainer v-if="ending" />
    <NewGame v-if="ending" />
    <SpectateGame />
    <div
      class="l-screen-overlay"
      v-if="shouldOverlay"
    />
  </div>
  `
}