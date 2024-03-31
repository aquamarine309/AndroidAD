/**
 * This slotted component manages a context menu that is accessible both
 * by right clicking and by hovering; this is mostly about wrangling timers.
 */

export default {
  name: "HoverMenu",
  props: {
    saveslot: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      timer: 0,
      contextMenuIsVisible: false
    }
  },
  methods: {
    show() {
      this.contextMenuIsVisible = true;
    },
    handleTouchStart() {
      this.timer = setTimeout(this.show, 600);
    },
    handleTouchMove() {
      clearTimeout(this.timer);
    },
    handleTouchEnd() {
      clearTimeout(this.timer);
    },
    handleClick() {
      clearTimeout(this.timer);
    },
    hide() {
      this.contextMenuIsVisible = false;
    }
  },
  created() {
    this.on$(GAME_EVENT.CLICK_SCREEN, this.hide);
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  template: `
  <div
    class="hover-menu__wrapper"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <slot
      ref="clown"
      name="object"
    />
    <slot
      v-if="contextMenuIsVisible"
      name="menu"
    />
  </div>
  `
}