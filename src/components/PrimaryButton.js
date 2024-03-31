export default {
  name: "PrimaryButton",
  props: {
    enabled: {
      type: Boolean,
      required: false,
      default: true
    },
    canHold: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    classObject() {
      return {
        "o-primary-btn--disabled": !this.enabled,
      };
    },
    onclick() {
      return this.$listeners.click;
    }
  },
	data() {
		return {
			holding: false
		}
	}, 
	methods: {
		update() {
			if (this.onclick && this.holding) {
			  this.onclick();
			}
		},
		holdStart() {
		  if (!this.canHold) return;
		  this.timer = setTimeout(() => {
		    this.holding = true;
		    this.onclick();
		  }, 1000);
		},
		holdEnd() {
		  if (!this.canHold) return;
		  clearTimeout(this.timer);
		  this.holding = false;
		}
	}, 
  template: `
    <button
    class="o-primary-btn"
    :class="classObject"
    v-on="$listeners"
    @touchstart="holdStart"
    @touchend="holdEnd"
    >
      <slot />
    </button>
  `
}