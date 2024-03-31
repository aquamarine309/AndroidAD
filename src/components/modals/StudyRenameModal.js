import ModalWrapperChoice from "./ModalWrapperChoice.js";

export default {
	name: "StudyRenameModal",
	components: {
	  ModalWrapperChoice
	},
	props: {
	  id: {
	    type: Number,
	    required: true
	  }
	},
	data() {
		return {
			input: ""
		}
	},
	computed: {
	  preset() {
	    return player.timestudy.presets[this.id];
	  },
	  isVaild() {
	    return /[a-zA-Z0-9]+/.test(this.input);
	  }
	},
	methods: {
	  confirm() {
	    if (!this.isVaild) return;
	    this.preset.name = this.input;
	  }
	},
	template: `
	  <ModalWrapperChoice
	    @confirm="confirm"
	    :show-confirm="isVaild"
	  >
	    <template #header>
        Rename study preset in slot {{ id + 1 }}
      </template>
      <input
        ref="input"
        v-model="input"
        type="text"
        maxlength="4"
        class="c-modal-input c-modal-import__input"
      >
	  </ModalWrapperChoice>
	`
}