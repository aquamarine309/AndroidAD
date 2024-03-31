import AndroidTabBar from "./AndroidTabBar.js";
import AndroidSubtabBar from "./AndroidSubtabBar.js";
import AndroidHotkeysRow from "./AndroidHotkeysRow.js";

export default {
  name: "AndroidUIBottom",
  components: {
    AndroidTabBar,
    AndroidSubtabBar,
    AndroidHotkeysRow
  },
	data() {
		return {
			showHotkey: true,
			isVisible: true
		}
	},
	methods: {
		update() {
			this.showHotkey = player.options.hotkeys;
		},
		changeVisible() {
		  this.isVisible = document.documentElement.clientHeight >= 400;
		}
	},
	created() {
	  this.isVisible = true;
	  this.on$(GAME_EVENT.KEYBOARD_CHANGE, this.changeVisible);
	},
  template: `
    <div
    class="c-android-ui--bottom"
    v-if="isVisible"
    >
      <div
      id="notification-container"
      class="l-notification-container"
      />
      <AndroidHotkeysRow v-if="showHotkey" />
      <AndroidTabBar />
      <AndroidSubtabBar />
    </div>
  `
}