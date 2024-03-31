export default {
name: "ModernTabButton",
props: {
tab: {
type: Object,
required: true
},
tabPosition: {
type: Number,
required: true
}
},
data() {
return {
isAvailable: false,
isHidden: false,
subtabVisibilities: [],
showSubtabs: false,
hasNotification: false,
tabName: ""
};
},
computed: {
classObject() {
return {
"o-tab-btn": true,
"o-tab-btn-m": true,
"o-tab-btn--modern-tabs": true,
"o-tab-btn--subtabs": this.showSubtabs,
"o-tab-btn--active": this.isCurrentTab && Theme.currentName() !== "S9",
"o-tab-btn--active-m": this.isCurrentTab && Theme.currentName() !== "S9"
};
},
isCurrentTab() {
return this.tab.isOpen;
}
},
methods: {
update() {
this.isAvailable = this.tab.isAvailable;
this.isHidden = this.tab.isHidden;
this.subtabVisibilities = this.tab.subtabs.map(x => x.isAvailable);
this.showSubtabs = this.isAvailable && this.subtabVisibilities.length >= 1;
this.hasNotification = this.tab.hasNotification;
if (this.tabPosition < Pelle.endTabNames.length) {
this.tabName = Pelle.transitionText(
this.tab.name,
Pelle.endTabNames[this.tabPosition],
Math.clamp(GameEnd.endState - (this.tab.id % 4) / 10, 0, 1)
);
} else {
this.tabName = this.tab.name;
}
},
isCurrentSubtab(id) {
return player.options.lastOpenSubtab[this.tab.id] === id && Theme.currentName() !== "S9";
}
},
template: `<div
v-if="!isHidden && isAvailable"
:class="[classObject, tab.config.UIClass]"
>
<div
class="l-tab-btn-inner"
@click="tab.show(true)"
>
{{ tabName }}
<div
v-if="hasNotification"
class="fas fa-circle-exclamation l-notification-icon"
/>
</div>
<div
v-if="showSubtabs"
class="subtabs"
>
<template
v-for="(subtab, index) in tab.subtabs"
>
<div
v-if="subtabVisibilities[index]"
:key="index"
class="o-tab-btn o-tab-btn-m o-tab-btn--subtab o-tab-btn--subtab-m"
:class="
[tab.config.UIClass,
{'o-subtab-btn--active-m': isCurrentSubtab(subtab.id)}]
"
@click="subtab.show(true)"
>
<span v-html="subtab.symbol" />
<div
v-if="subtab.hasNotification"
class="fas fa-circle-exclamation l-notification-icon"
/>
<div class="o-subtab__tooltip">
{{ subtab.name }}
</div>
</div>
</template>
</div>
</div>`
}
