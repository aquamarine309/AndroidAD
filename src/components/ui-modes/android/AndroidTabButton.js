export default {
	name: "AndroidTabButton",
	props: {
	  tab: {
	    type: Object,
	    required: true
	  },
	  tabPosition: {
	    type: Number,
	    required: true
	  }
	},
	data() {
		return {
      isAvailable: false,
      hasNotification: false,
      tabName: ""
    };
	},
	computed: {
	  displayName() {
	    return this.tab.shortName || this.tab.name.slice(0, 1).toUpperCase();
	  },
	  tabClass() {
	    return {
	      "c-android-ui--bottom__tab-btn": true,
	      "c-android-ui--bottom__tab-btn--open": this.tab.isOpen && Theme.currentName() !== "S9"
	    }
	  },
	  fullName() {
	    return this.tab.name;
	  }
	},
	methods: {
		update() {
			this.isAvailable = this.tab.isAvailable;
      this.hasNotification = this.tab.hasNotification;
      if (this.tabPosition < Pelle.endTabNames.length) {
        this.tabName = Pelle.transitionText(
          this.displayName,
          Pelle.endTabNames[this.tabPosition],
          Math.max(Math.min(GameEnd.endState - (this.tab.id) % 4 / 10, 1), 0)
        );
      } else {
        this.tabName = this.displayName;
      }
		}
	},
	template: `
	  <div
	  v-if="isAvailable"
	  :class="tabClass"
	  @click="tab.show(true)"
	  >
	    {{ tabName }}
	  </div>
	`
}