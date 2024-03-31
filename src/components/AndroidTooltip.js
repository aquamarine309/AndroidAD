export default {
	name: "AndroidTooltip",
	data() {
		return {
			isVisible: false
		}
	},
	props: {
	  text: {
	    type: String,
	    required: true
	  },
	  condition: {
	    type: Boolean,
	    required: false,
	    default: true
	  }
	},
	created() {
	  this.on$(GAME_EVENT.CLICK_SCREEN, () => {
	    this.isVisible = false;
	  });
	},
	methods: {
	  change() {
	    if (!this.condition) return;
	    const last = this.isVisible;
	    EventHub.ui.dispatch(GAME_EVENT.CLICK_SCREEN);
	    if (last) return;
	    this.isVisible = true;
	  }
	},
	template: `
	<span
	@touchstart.stop="change"
	>
	  <Transition name="a-android-tooltip">
	    <div
	      v-if="isVisible"
	      class="c-android-tooltip"
	      ref="tooltip"
	    >
	      {{ text }}
	    </div>
	  </Transition>
	  <slot />
	</span>
	`
}