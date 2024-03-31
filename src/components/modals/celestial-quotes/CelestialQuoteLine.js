import CelestialQuoteBackground from "./CelestialQuoteBackground.js";

export default {
  name: "CelestialQuoteLine",
  components: {
    CelestialQuoteBackground
  },
  props: {
    quote: {
      type: Object,
      required: true
    },
    currentLine: {
      type: Number,
      required: true
    },
    primary: {
      type: Boolean,
      required: false,
      default: false,
    },
    leftVisible: {
      type: Boolean,
      required: false,
      default: false
    },
    rightVisible: {
      type: Boolean,
      required: false,
      default: false
    },
    closeVisible: {
      type: Boolean,
      required: false,
      default: false
    },
  },
  data() {
    return {
      message: "",
      celestialSymbols: [],
      celestials: [],
      celestialName: ""
    };
  },
  computed: {
    line() {
      return this.quote.line(this.currentLine);
    },
    leftClass() {
      return {
        "c-modal-celestial-quote__arrow": true,
        "c-modal-celestial-quote__arrow-left": true,
        "c-modal-celestial-quote__arrow-invisible": !this.leftVisible,
        "fas": true,
        "fa-chevron-circle-left": true,
      };
    },
    rightClass() {
      return {
        "c-modal-celestial-quote__arrow": true,
        "c-modal-celestial-quote__arrow-right": true,
        "c-modal-celestial-quote__arrow-invisible": !this.rightVisible,
        "fas": true,
        "fa-chevron-circle-right": true,
      };
    },
  },
  methods: {
    update() {
      const line = this.line;
      this.celestialSymbols = line.celestialSymbols;
      this.message = line.line;
      this.celestials = line.celestials;
      this.celestialName = line.celestialName;
    }
  },
  template: `<CelestialQuoteBackground
:celestial-symbols="celestialSymbols"
:celestials="celestials"
:primary="primary"
>
<span
v-if="line.showCelestialName"
class="c-modal-celestial-name"
>
{{ celestialName }}
</span>

<i
:class="leftClass"
@click="$emit('progress-in', 'left')"
/>

<span class="l-modal-celestial-quote__text">
{{ message }}
</span>

<i
:class="rightClass"
@click="$emit('progress-in', 'right')"
/>
<i
v-if="closeVisible"
class="c-modal-celestial-quote__end fas fa-check-circle"
@click="emitClose"
/>
</CelestialQuoteBackground>`
}