import AndroidTabButton from "./AndroidTabButton.js";

export default {
	name: "AndroidTabBar",
	components: {
	  AndroidTabButton
	},
	computed: {
	  tabs: () => Tabs.newUI
	},
	template: `
	  <div class="android-tab-bar">
	    <AndroidTabButton
	    v-for="(tab, i) in tabs"
	    :key="tab.name"
	    :tab="tab"
	    :tabPosition="i"
	    />
	  </div>
	`
}