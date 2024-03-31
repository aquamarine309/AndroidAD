import AndroidHotkeyButton from "./AndroidHotkeyButton.js";

export default {
	name: "AndroidHotkeysRow",
	components: {
	  AndroidHotkeyButton
	},
	computed: {
	  hotkeys: () => GameDatabase.hotkeys
	},
	template: `
		<div class="l-hotkeys-row">
		  <AndroidHotkeyButton
		  v-for="hotkey in hotkeys"
		  :key="hotkey.label"
		  :hotkey="hotkey"
		  />
		</div>
	`
}