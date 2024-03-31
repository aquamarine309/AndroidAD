import TimeTheoremBuyButton from "./TimeTheoremBuyButton.js";

export default {
  name: "TimeTheoremShop",
  components: {
    TimeTheoremBuyButton
  },
  data() {
    return {
      theoremAmount: new Decimal(0),
      theoremGeneration: new Decimal(0),
      totalTimeTheorems: new Decimal(0),
      hasTTAutobuyer: false,
      isAutobuyerOn: false,
      budget: {
        am: new Decimal(0),
        ip: new Decimal(0),
        ep: new Decimal(0)
      },
      costs: {
        am: new Decimal(0),
        ip: new Decimal(0),
        ep: new Decimal(0)
      },
      showST: false,
      STamount: 0,
      hasTTGen: false,
      showTTGen: false,
      invertTTgenDisplay: false,
    };
  },
  computed: {
    formatTimeTheoremType() {
      if (this.theoremAmount.gte(1e6)) {
        return format;
      }
      if (!(Teresa.isRunning || Enslaved.isRunning) && getAdjustedGlyphEffect("dilationTTgen") > 0 && !DilationUpgrade.ttGenerator.isBought) {
        return formatFloat;
      }
      return formatInt;
    },
    TTgenRateText() {
      if (this.theoremGeneration.lt(1 / 3600)) {
        return `one TT every ${TimeSpan.fromSeconds(
this.theoremGeneration.reciprocal().toNumber()).toStringShort(false)}`;
      }
      if (this.theoremGeneration.lt(0.1)) {
        return `${format(this.theoremGeneration.times(3600), 2, 2)} TT/hour`;
      }
      return `${format(this.theoremGeneration, 2, 2)} TT/sec`;
    },
    totalTimeTheoremText() {
      return `(${quantify("total Time Theorem", this.totalTimeTheorems, 2, 2, this.formatTimeTheoremType)})`;
    }
  },
  watch: {
    isAutobuyerOn(newValue) {
      Autobuyer.timeTheorem.isActive = newValue;
    },
    invertTTgenDisplay(newValue) {
      player.options.invertTTgenDisplay = newValue;
    },
  },
  methods: {
    formatAM(am) {
      return `${format(am)} AM`;
    },
    buyWithAM() {
      TimeTheorems.buyOne(false, "am");
    },
    formatIP(ip) {
      return `${format(ip)} IP`;
    },
    buyWithIP() {
      TimeTheorems.buyOne(false, "ip");
    },
    formatEP(ep) {
      return `${format(ep, 2, 0)} EP`;
    },
    buyWithEP() {
      TimeTheorems.buyOne(false, "ep");
    },
    buyMaxTheorems() {
      TimeTheorems.buyMax(false);
    },
    update() {
      this.theoremAmount.copyFrom(Currency.timeTheorems);
      this.theoremGeneration.copyFrom(getTTPerSecond()
        .times(getGameSpeedupForDisplay()));
      this.totalTimeTheorems.copyFrom(Currency.timeTheorems.max);
      this.hasTTAutobuyer = Autobuyer.timeTheorem.isUnlocked;
      this.isAutobuyerOn = Autobuyer.timeTheorem.isActive;
      const budget = this.budget;
      budget.am.copyFrom(TimeTheoremPurchaseType.am.currency);
      budget.ip.copyFrom(TimeTheoremPurchaseType.ip.currency);
      budget.ep.copyFrom(TimeTheoremPurchaseType.ep.currency);
      const costs = this.costs;
      costs.am.copyFrom(TimeTheoremPurchaseType.am.cost);
      costs.ip.copyFrom(TimeTheoremPurchaseType.ip.cost);
      costs.ep.copyFrom(TimeTheoremPurchaseType.ep.cost);
      this.showST = V.spaceTheorems > 0 && !Pelle.isDoomed;
      this.STamount = V.availableST;
      this.hasTTGen = this.theoremGeneration.gt(0);
      this.showTTGen = this.hasTTGen && (ui.view.shiftDown === this.invertTTgenDisplay);
      this.invertTTgenDisplay = player.options.invertTTgenDisplay;
    },
    toggleTTgen() {
      this.invertTTgenDisplay = !this.invertTTgenDisplay;
    }
  },
  template: `
  <div class="o-time-theorem-shop">
    <div class="c-header-currency-info">
      <div>
        You have <span class="c-tt-amount">{{ formatTimeTheoremType(theoremAmount, 2, 0) }}</span> {{ pluralize("Time Theorem", theoremAmount) }}.
      </div>
      <div v-if="showST">
        You have <span class="c-tt-amount">{{ formatInt(STamount) }}</span> {{ pluralize("Space Theorem", STamount) }}.
      </div>
      <div
        v-if="showTTGen"
        class="c-tt-gen"
      >
       You are gaining {{ TTgenRateText }}.
      </div>
      <div
        class="c-tt-total"
        v-else
      >
       {{ totalTimeTheoremText }}
      </div>
    </div>
    <div class="l-time-studies-tab-row">
      <button
        class="l-tt-buy-button c-tt-buy-button c-tt-buy-button--unlocked c-tt-max-all"
        @click="buyMaxTheorems"
      >
        Buy Max Throrems
      </button>
    </div>
    <div class="l-time-studies-tab-row">
      <TimeTheoremBuyButton
        :budget="budget.am"
        :cost="costs.am"
        :format-cost="formatAM"
        :action="buyWithAM"
      />
      <TimeTheoremBuyButton
        :budget="budget.ip"
        :cost="costs.ip"
        :format-cost="formatIP"
        :action="buyWithIP"
      />
      <TimeTheoremBuyButton
        :budget="budget.ep"
        :cost="costs.ep"
        :format-cost="formatEP"
        :action="buyWithEP"
      />
    </div>
  </div>
  `
}