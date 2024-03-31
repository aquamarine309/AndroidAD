export default {
	name: "AndroidSubtabButton",
	props: {
	  subtab: {
	    type: Object,
	    required: true
	  },
	  parentName: {
	    type: String,
	    required: true
	  }
	},
	data() {
		return {
      isAvailable: false,
      hasNotification: false,
      isCurrentSubtab: false,
      tabName: ""
    };
	},
	computed: {
	  displayName() {
	    return this.subtab.name.toUpperCase();
	  },
	  tabClass() {
	    return {
	      "c-android-ui--bottom__tab-btn": true,
	      "c-android-ui--bottom__tab-btn--open": this.subtab.isOpen && Theme.currentName() !== "S9",
	      "c-android-ui--bottom__subtab-btn": true
	    }
	  }
	},
	methods: {
		update() {
      this.isAvailable = this.subtab.isAvailable;
      this.hasNotification = this.subtab.hasNotification;
      this.isCurrentSubtab = this.subtab.isOpen && Theme.currentName() !== "S9";
      this.tabName = Pelle.transitionText(
        this.displayName,
        this.displayName,
        Math.max(Math.min(GameEnd.endState - (this.subtab.id) % 4 / 10, 1), 0))
		}
	},
	template: `
	  <div
	  v-if="isAvailable"
	  :class="tabClass"
	  @click="subtab.show(true)"
	  >
	    {{ tabName }}
	  </div>
	`
}