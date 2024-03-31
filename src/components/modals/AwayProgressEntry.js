export default {
  name: "AwayProgressEntry",
  props: {
    name: {
      type: String,
      required: true
    },
    playerBefore: {
      type: Object,
      required: true
    },
    playerAfter: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      removed: false,
    };
  },
  computed: {
    item() {
      return AwayProgressTypes.all[this.name];
    },
    before() {
      return this.item.navigateTo(this.playerBefore);
    },
    after() {
      return this.item.navigateTo(this.playerAfter);
    },
    formatBefore() {
      return this.formatPseudo(this.before);
    },
    formatAfter() {
      return this.formatPseudo(this.after);
    },
    classObject() {
      return {
        "c-modal-away-progress__disabled": this.removed
      };
    },
    resourceClass() {
      return {
        [this.item.classObject]: !this.removed
      }
    },
    formattedName() {
      return this.item.formatName;
    },
    increased() {
      // If they would visually display as the same number, they shouldn't be treated as if they increased
      if (this.formatAfter === this.formatBefore) return false;
      // Both Decimals and numbers may be passed in. This code handles both.
      const before = this.before;
      const after = this.after;

      return after instanceof Decimal ? after.gt(before) : after > before;
    },
    show() {
      if (!this.item.appearsInAwayModal) return false;
      const show = this.increased && this.item.option && this.item.isUnlocked();
      // For the achievement and display, we need to emit if something happened to the parent
      if (show) this.$emit("something-happened");
      return show;
    },
    isBlackHole() {
      // If its a Black Hole we need different formatting, so find that
      return this.item.name.includes("BlackHole");
    },
    formatBlackHoleActivations() {
      const activations = this.after - this.before;
      return quantifyInt("time", activations);
    },
    isVeryLarge() {
      return this.isBlackHole ? false : Decimal.gt(this.before, Decimal.pow10(1e9));
    }
  },
  methods: {
    // We want different formatting above and below 1e9 to improve readability
    formatPseudo(number) {
      // Sometimes it's undefined and that throws errors, because this method is also used to determine whether or
      // not any text is even shown at all and sometimes this gets checked on variables which don't have values yet
      if (number === undefined) return "";
      // Surrounding text is formatted differently to specify that this is log10
      if (this.isVeryLarge) return formatInt(Math.floor(number.log10()));
      if (Decimal.lt(number, 1e9)) {
        // Both numbers and decimals get passed in here so this is needed
        // Not a fan of this solution but whatever
        const numberAsDecimal = new Decimal(number);
        return formatInt(numberAsDecimal.floor());
      }
      return format(number, 2, 2);
    },
    hideEntry() {
      this.removed = !this.removed;
      this.item.option = !this.item.option;
    }
  },
  template: `
    <div
    v-if="show"
    :class="classObject"
    @click="hideEntry"
    >
      <span v-if="isBlackHole">
        Your
        <b :class="resourceClass">{{ formattedName }}</b>
        activated
        {{ formatBlackHoleActivations }}
      </span>
      <span v-else>
        <b :class="resourceClass">{{ formattedName }}</b>
        <i v-if="isVeryLarge"> exponent</i>
        increased from
        {{ formatBefore }} to {{ formatAfter }}
      </span>
    </div>
  `
}