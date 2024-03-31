import ModalCloseButton from "./ModalCloseButton.js";

export default {
name: "ChangelogModal",
components: {
ModalCloseButton,
},
data() {
return {
entryId: 0,
};
},
computed: {
shownEntry: {
get() {
return GameDatabase.changelog[this.entryId];
},
set(entry) {
this.entryId = entry.id;
}
},
entries() {
return GameDatabase.changelog;
}
},
methods: {
setShownEntry(tab) {
this.shownEntry = tab;
this.$refs.changelogBody.scrollTop = 0;
},
formatDate(date) {
return date.map(n => (Math.log10(n) >= 2 ? n : `0${n}`.slice(-2))).join("-");
}
},
template: `<div class="l-changelog-modal">
<ModalCloseButton @click="emitClose" />
<div class="l-changelog-header">
<div class="c-changelog-title">
Changelog
</div>
</div>
<div class="l-changelog-container">
<div class="l-changelog-search-tab">
<div class="l-changelog-tab-list">
<div
v-for="entry in entries"
:key="entry.id"
class="o-changelog-tab-button"
:class="{
'o-changelog-tab-button--selected': entry === shownEntry
}"
@click="setShownEntry(entry)"
>
{{ formatDate(entry.date) }}
</div>
</div>
</div>
<div class="l-changelog-info">
<div class="c-changelog-body--title">
{{ formatDate(shownEntry.date) }}<span v-if="shownEntry.name">: "{{ shownEntry.name }}" update</span>
</div>
<div
ref="changelogBody"
class="l-changelog-body c-changelog-body"
v-html="shownEntry.info"
/>
</div>
</div>
</div>`
}
