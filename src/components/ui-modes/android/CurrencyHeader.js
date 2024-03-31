export
default {
  name: "CurrencyHeader",
  data() {
    return {
      sidebarID: 0,
      resourceName: "",
      resourceValue: new Decimal(0)
    };
  },
  computed: {
    resourceDB: () => GameDatabase.sidebarResources,
    numDBEntries() {
      return this.resourceDB.length;
    },
    resource() {
      // With "default" sorting, return the latest unlocked resource - otherwise, return the specified one
      return this.sidebarID === 0 ? this.resourceDB.filter(e => e.isAvailable())
        .sort((a, b) => b.id - a.id)[0] : this.resourceDB.find(e => e.id === this.sidebarID);
    },
    displayValue() {
      // RM + iM seems to cause strange, undesirable linebreaks
      return this.resource.formatValue(this.resourceValue)
        .replace(" + ", "+");
    }
  },
  methods: {
    update() {
      this.sidebarID = player.options.sidebarResourceID;
      this.resourceName = this.resource.resourceName ?? this.resource.optionName;
      this.resourceValue.copyFrom(this.resource.value());
    }
  },
	template: `
		<div class="c-android-ui-header-content">
		  {{ displayValue }} {{ resourceName }}
		</div>
	` 
}