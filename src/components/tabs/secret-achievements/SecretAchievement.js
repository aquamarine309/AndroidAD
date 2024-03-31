export default {
  name: "SecretAchievement",
  props: {
    achievement: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      offset: 0
    };
  },
  computed: {
    id() {
      return this.achievement.id;
    },
    config() {
      return this.achievement.config;
    },
    styleObject() {
      if (!this.isUnlocked) return null;
      return {
        "background-position": `-${(this.achievement.column - 1) * 12.5}vw -${(this.achievement.row - 1) * 12.5}vw`
      }
    },
    classObject() {
      return {
        "o-achievement": true,
        "o-achievement--hidden": !this.isUnlocked,
        "o-achievement--unlocked": this.isUnlocked,
        "o-achievement--secret": true,
        "o-achievement--open": this.isOpen
      };
    },
    isOpen() {
      return this.id === this.openId;
    },
    tooltipClass() {
      return {
        "o-achievement__tooltip": true,
        "o-achievement__tooltip--reverse": this.offset - 40 < window.innerHeight / 2
      }
    },
    tooltipStyle() {
      if (this.achievement.column <= 2) return {
        left: `-${12.5 * (this.achievement.column - 1)}vw`
      };
      if (this.achievement.column >= 7) return {
        left: `calc(${12.5 * (9 - this.achievement.column)}vw - 23rem)`
      };
      return {};
    },
    openId() {
      return this.$viewModel.achievementId;
    }
  },
  beforeDestroy() {
    ScreenOverlay.clear();
  },
  methods: {
    update() {
      this.isUnlocked = this.achievement.isUnlocked;
      if (this.$refs.ach) {
        const ach = this.$refs.ach.getBoundingClientRect();
        this.offset = ach.y;
      };
    },
    toggle() {
      if (this.id === 11) {
        SecretAchievement(11)
          .unlock();
      };
      if (this.openId !== 0) {
        this.$viewModel.achievementId = 0;
      } else {
        this.$viewModel.achievementId = this.id;
      };
      EventHub.dispatch(GAME_EVENT.OVERLAY_UPDATE);
    }
  },
  template: `<div
:class="classObject"
:style="styleObject"
@touchstart.stop
@click.stop="toggle"
ref="ach"
>
<Transition name="a-android-tooltip">
<div :class="tooltipClass" :style="tooltipStyle" v-if="isOpen">
<template>
<div class="o-achievement__tooltip__name">
{{ config.name }} (S{{ id }})
</div>
<div
v-if="isUnlocked"
class="o-achievement__tooltip__description"
>
{{ config.description }}
</div>
</template>
</div>
</Transition>
</div>`
}