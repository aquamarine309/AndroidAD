import OfflineSpeedupButton from "../OfflineSpeedupButton.js";

export default {
  name: "ModalProgressBar",
  components: {
    OfflineSpeedupButton,
  },
  data() {
    return {
      initialTotalTick: 0
    }
  },
  created() {
    this.initialTotalTick = this.progress.max
  },
  computed: {
    progress() {
      return this.$viewModel.modal.progressBar;
    },
    foregroundStyle() {
      return {
        width: `${this.progress.current / this.progress.max * 100}%`,
      };
    },
    remainingTime() {
      const timeSinceStart = Date.now() - this.progress.startTime;
      const ms = timeSinceStart * (this.progress.max - this.progress.current) / this.progress.current;
      return TimeSpan.fromMilliseconds(ms)
        .toStringShort();
    },
    buttons() {
      return this.progress.buttons || [];
    },
    currentTime() {
      const ms = this.progress.current * player.options.updateRate * (this.initialTotalTick / this.progress.max);
      return TimeSpan.fromMilliseconds(ms)
        .toStringDecimals();
    },
    totalTime() {
      const ms = this.initialTotalTick * player.options.updateRate;
      return TimeSpan.fromMilliseconds(ms)
        .toStringDecimals();
    }
  },
  template: `<div
class="l-modal-overlay c-modal-overlay progress-bar-modal"
>
<div class="c-modal">
<div class="modal-progress-bar">
<div class="modal-progress-bar__label">
{{ progress.label }}
</div>
<div class="modal-progress-bar__margin">
<div>
{{ currentTime }}/{{ totalTime }} time simulated
</div>
<div>
{{ formatInt(progress.current) }}/{{ formatInt(progress.max) }} ticks done
</div>
<div>
Time left: {{ remainingTime }}
</div>
<div class="modal-progress-bar__hbox">
<div class="modal-progress-bar__bg">
<div
class="modal-progress-bar__fg"
:style="foregroundStyle"
/>
</div>
</div>
</div>
<div class="modal-progress-bar__buttons">
<OfflineSpeedupButton
v-for="(button, id) in buttons"
:key="id"
:button="button"
:progress="progress"
/>
</div>
</div>
</div>
</div>`
}