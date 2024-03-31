export default {
	name: "AndroidHotkeyButton",
	props: {
	  hotkey: {
	    type: Object,
	    required: true
	  }
	},
	data() {
		return {
			isUnlocked: false,
			isMarked: false,
			startTime: Date.now(),
			endTime: Date.now(),
			tapCount: 0,
			hasShownTip: false,
			isHolding: false,
			modifyingHotkeys: false,
			isDisabled: false
		}
	},
	computed: {
	  classObject() {
	    return {
	      "c-hotkey-btn": true,
	      "c-hotkey-btn__small": this.hotkey.label.length > 1,
	      "c-hotkey-btn--active": this.isActive || this.isHolding,
	      "c-hotkey-btn--marked": this.isMarked && !this.isDisabled
	    }
	  },
	  isActive() {
	    return this.view.hotkey === this.hotkey.id;
	  },
	  view() {
      return this.$viewModel;
    },
    displayLabel() {
      if (this.isDisabled) return "-";
      return this.hotkey.label;
    },
    isVisible() {
      return this.isUnlocked && (!this.isDisabled || this.modifyingHotkeys);
    }
	},
	methods: {
		update() {
		  this.isDisabled = ((player.options.disableHotkeyBits & (1 << this.hotkey.id)) !== 0);
		  this.isUnlocked = this.hotkey.condition?.() ?? true;
		  this.modifyingHotkeys = player.options.modifyHotkey;
		  this.isMarked = this.hotkey.mark?.() ?? false;
			if (this.isActive || this.isHolding) {
			  this.hotkey.active();
			}
		},
		activate() {
		  if (this.modifyingHotkeys) return;
		  if (this.isActive) {
		    this.view.hotkey = -1;
		  }
		  if (Date.now() - this.endTime <= 200) {
		    this.tapCount++;
		    //id{0}: max-all Button.
		    if (this.tapCount > 5 && !this.hasShownTip && this.hotkey.id === 0) {
		      GameUI.notify.info("You can hold the Max button instead of clicking it.", 2000, null);
		      this.hasShownTip = true;
		    }
		  } else {
		    this.tapCount = 0;
		  }
		  
		  this.startTime = Date.now();
		  this.isHolding = true;
		  this.hotkey.active();
		},
		deactivate() {
		  if (this.modifyingHotkeys) return;
		  if (Date.now() - this.startTime > 1200) {
		    this.view.hotkey = this.hotkey.id;
		    return;
		  };
		  this.isHolding = false;
		  this.endTime = Date.now();
		},
		modify() {
		  if (!this.modifyingHotkeys) return;
		  if (this.isDisabled) {
		    player.options.disableHotkeyBits &= ~(1 << this.hotkey.id);
		  } else {
		    player.options.disableHotkeyBits |= (1 << this.hotkey.id);
		  }
		}
	},
	watch: {
	  isActive(newValue) {
	    this.isHolding = newValue;
	  }
	},
	template: `
		<div
		v-if="isVisible"
		:class="classObject"
		@touchstart="activate"
		@touchend="deactivate"
		@click="modify"
		>
		  {{ displayLabel }}
		</div>
	`
}