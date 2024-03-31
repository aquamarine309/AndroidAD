import wordShift from "../../../core/word-shift.js";

import EffectDisplay from "../../EffectDisplay.js";

export default {
  name: "NormalAchievement",
  components: {
    EffectDisplay
  },
  props: {
    achievement: {
      type: Object,
      required: true
    },
    isObscured: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      isDisabled: false,
      isUnlocked: false,
      isMouseOver: false,
      isCancer: false,
      realityUnlocked: false,
      garbleTimer: 0,
      garbleKey: 0,
      achievementTime: 0,
      offset: 0
    };
  },
  computed: {
    id() {
      return this.achievement.id;
    },
    displayId() {
      let info;
      if (this.isDisabled) {
        info = "disabled";
      } else if (!this.isUnlocked && this.isPreRealityAchievement) {
        info = "waiting";
      } else if (!this.isUnlocked) {
        info = "not completed";
      } else {
        info = "completed"
      }
      return `r${this.config.displayId ?? this.id}, ${info}`;
    },
    config() {
      return this.achievement.config;
    },
    openId() {
      return this.$viewModel.achievementId;
    },
    styleObject() {
      if (this.isObscured) return {
        "background-size": "12.5vw"
      };
      return {
        "background-size": "100vw 225vw",
        "background-position": `-${(this.achievement.column - 1) * 12.5}vw -${(this.achievement.row - 1) * 12.5}vw`
      };
    },
    classObject() {
      return {
        "o-achievement": true,
        "o-achievement--disabled": this.isDisabled,
        "o-achievement--locked": !this.isUnlocked && !this.isDisabled && !this.isObscured,
        "o-achievement--unlocked": this.isUnlocked,
        "o-achievement--waiting": !this.isUnlocked && this.isPreRealityAchievement && !this.isDisabled,
        "o-achievement--blink": !this.isUnlocked && this.id === 78 && !this.isDisabled,
        "o-achievement--normal": !this.isCancer && !this.isObscured,
        "o-achievement--cancer": this.isCancer && !this.isObscured,
        "o-achievement--hidden": this.isObscured,
        "o-achievement--open": this.isOpen
      };
    },
    indicatorIconClass() {
      if (this.isUnlocked) return "fas fa-check";
      if (this.isPreRealityAchievement && !this.isDisabled) return "far fa-clock";
      return "fas fa-times";
    },
    indicatorClassObject() {
      return {
        "o-achievement__indicator": true,
        "o-achievement__indicator--disabled": this.isDisabled,
        "o-achievement__indicator--locked": !this.isUnlocked && !this.isPreRealityAchievement && !this.isDisabled,
        "o-achievement__indicator--waiting": !this.isUnlocked && this.isPreRealityAchievement && !this.isDisabled,
      };
    },
    rewardClassObject() {
      return {
        "o-achievement__reward": true,
        "o-achievement__reward--disabled": this.isDisabled,
        "o-achievement__reward--locked": !this.isUnlocked && !this.isPreRealityAchievement && !this.isDisabled,
        "o-achievement__reward--waiting": !this.isUnlocked && this.isPreRealityAchievement && !this.isDisabled,
      };
    },
    isOpen() {
      return this.openId === this.id;
    },
    isPreRealityAchievement() {
      return this.realityUnlocked && this.achievement.row <= 13;
    },
    hasReward() {
      return this.config.reward !== undefined && !this.isObscured;
    },
    // The garble templates themselves can be static, and shouldn't be recreated every render tick
    garbledNameTemplate() {
      return this.makeGarbledTemplate(this.config.name);
    },
    garbledIDTemplate() {
      return this.makeGarbledTemplate(this.displayId);
    },
    garbledDescriptionTemplate() {
      return this.makeGarbledTemplate(this.config.description);
    },
    achievedTime() {
      if (!player.speedrun.isActive) return null;
      if (this.achievementTime === undefined) return "Not Achieved yet";
      return this.achievementTime === 0 ? "Given at Speedrun start" : `Achieved after ${TimeSpan.fromMilliseconds(this.achievementTime).toStringShort()}`;
    },
    tooltipClass() {
      return {
        "o-achievement__tooltip": true,
        "o-achievement__tooltip--reverse": this.offset < window.innerHeight / 2 || this.achievement.row < 3
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
    }
  },
  beforeDestroy() {
    ScreenOverlay.clear();
  },
  methods: {
    update() {
      this.isDisabled = Pelle.disabledAchievements.includes(this.id) && Pelle.isDoomed;
      this.isUnlocked = this.achievement.isUnlocked && !this.isDisabled;
      this.isCancer = Theme.current()
        .name === "S4" || player.secretUnlocks.cancerAchievements;
      this.realityUnlocked = PlayerProgress.realityUnlocked();

      this.processedName = this.processText(this.config.name, this.garbledNameTemplate);
      this.processedId = this.processText(this.displayId, this.garbledIDTemplate);
      this.processedDescription = this.processText(this.config.description, this.garbledDescriptionTemplate);
      if (this.$refs.ach) {
        const ach = this.$refs.ach.getBoundingClientRect();
        this.offset = ach.y;
      };
      // This uses key-swapping to force the garbled achievements to re-render their text, because otherwise they
      // would remain static. Keys for non-garbled achievements won't change, and all keys remain unique.
      this.garbleTimer++;
      if (this.isObscured) {
        this.garbleKey = 10 * this.id + Math.floor(this.garbleTimer / 3);
      } else {
        this.garbleKey = this.id;
      }
      if (player.speedrun.isActive) this.achievementTime = player.speedrun.achievementTimes[this.id];
    },
    toggle() {
      if (ScreenOverlay.modal) return;
      if (this.openId !== 0) {
        this.$viewModel.achievementId = 0;
      } else {
        this.$viewModel.achievementId = this.id;
      };
      EventHub.dispatch(GAME_EVENT.OVERLAY_UPDATE);
    },
    // We don't want to expose the original text for Pelle achievements, so we generate a random string with the same
    // length of the original text in order to make something that fits reasonably within their respective places
    makeGarbledTemplate(input) {
      // Input might be either text or number
      const text = `${input}`;
      let garbled = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") garbled += " ";
        else {
          const n = text[i].charCodeAt();
          // Essentially seeded randomness so that the static parts of the randomized text are deterministic
          garbled += String.fromCharCode(33 + ((n * n + i * i) % 93));
        }
      }
      return garbled;
    },
    // When appropriate, garbles input text for achievements on the last row. Otherwise leaves it unchanged
    processText(unmodified, garbledTemplate) {
      if (!this.isObscured) return unmodified;

      // The garbling effect often replaces spaces with non-spaces, which affects line length and can cause individual
      // lines to become long enough that they can't word-wrap. To address that, we take the template as a reference
      // and put spaces back into the same spots, ensuring that text can't overflow any worse than the original text
      const raw = wordShift.randomCrossWords(garbledTemplate);
      let modified = "";
      for (let i = 0; i < raw.length; i++) {
        if (garbledTemplate[i] === " ") modified += " ";
        else modified += raw[i];
      }
      return modified;
    }
  },
  template: `<div
:class="classObject"
:style="styleObject"
@touchstart.stop
@click.stop="toggle"
ref="ach"
:key="garbleKey"
>
<Transition name="a-android-tooltip">
<div :class="tooltipClass" v-if="isOpen" :style="tooltipStyle">
<template>
<div class="o-achievement__tooltip__name">
{{ processedName }}
</div>
<div class="o-achievement__tooltip__id">
({{ processedId }})
</div>
<div class="o-achievement__tooltip__description">
{{ processedDescription }}
</div>
<div
v-if="config.reward"
class="o-achievement__tooltip__reward"
>
<span
v-if="!isObscured"
:class="{ 'o-pelle-disabled': isDisabled }"
>
Reward: {{ config.reward }}
<EffectDisplay
v-if="config.formatEffect"
br
:config="config"
/>
</span>
</div>
<div
v-if="achievedTime"
class="o-achievement-time"
>
{{ achievedTime }}
</div>
</template>
</div>
</Transition>
</div>`
}