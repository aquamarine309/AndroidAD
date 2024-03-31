import AndroidSubtabButton from "./AndroidSubtabButton.js";

export default {
	name: "AndroidSubtabBar",
	components: {
	  AndroidSubtabButton
	},
	computed: {
	  tab: () => Tabs.current,
	  subtabs() {
	    return this.tab.subtabs
	  }
	},
	template: `
	  <div class="android-tab-bar">
	    <AndroidSubtabButton
	    v-for="(subtab, i) in subtabs"
	    :key="subtab.name"
	    :subtab="subtab"
	    :parent-name="tab.name"
	    />
	  </div>
	`
}