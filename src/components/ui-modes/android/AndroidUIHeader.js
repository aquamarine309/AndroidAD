import CurrencyHeader from "./CurrencyHeader.js";
import OpenNavigationDrawerButton from "./OpenNavigationDrawerButton.js";

export default {
	name: "AndroidUIHeader",
	components: {
	  CurrencyHeader,
	  OpenNavigationDrawerButton
	},
	data() {
		return {
			modifyHotkey: false
		}
	},
	methods: {
		update() {
			this.modifyHotkey = player.options.modifyHotkey;
		}
	},
	computed: {
	  showInfo() {
	    return this.modifyHotkey;
	  },
	  infoText() {
	    if (this.modifyHotkey) return "Click to hide/show hotkey buttons.";
	    return "";
	  }
	},
	template: `
	<div class="l-android-ui-header c-android-ui-header">
		<OpenNavigationDrawerButton />
		<CurrencyHeader />
	  <div
		  class="l-android-ui-header-info"
		  v-if="showInfo"
		>
		  {{ infoText }}
		</div>
	</div>
	`
}