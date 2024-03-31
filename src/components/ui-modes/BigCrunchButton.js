export default {
  name: "BigCrunchButton",
  data() {
    return {
      shouldDisplay: false
    };
  },
  methods: {
    update() {
      this.shouldDisplay = !player.break && Player.canCrunch;
    },
    handleClick() {
      if (PlayerProgress.infinityUnlocked()) bigCrunchResetRequest();
      else Modal.bigCrunch.show();
    }
  },
  template: `
    <span v-if="shouldDisplay">
      <div>
        <h3 class="l-spacing c-crunch-text">
          The world has collapsed due to excess antimatter.
        </h3>
        <button
        class="btn-big-crunch"
        @click="handleClick"
        >
          Big Crunch
        </button>
      </div>
    </span>
  `
}