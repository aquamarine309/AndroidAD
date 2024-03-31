export default {
name: "CreditsDisplay",
props: {
isModal: {
type: Boolean,
required: false,
default: false
}
},
computed: {
people() { return GameDatabase.credits.people; },
roles() { return GameDatabase.credits.roles; },
isS12EndDisplay() { return this.$viewModel.theme === "S12" && !this.isModal; },
},
methods: {
relevantPeople(role) {
return this.people
.filter(x => (typeof x.roles === "number" ? x.roles === role : x.roles.includes(role)))
.sort((a, b) => a.name.localeCompare(b.name));
},
},
template: `<div :class="{ 'c-credits-s12-end': isS12EndDisplay }">
<h1
v-if="!isModal"
class="c-credits-header"
>
Antimatter Dimensions
</h1>

<div
v-for="role in roles.count"
:key="role"
>
<h2 class="c-credits-section">
{{ pluralize(roles[role], relevantPeople(role).length) }}
</h2>
<div :class="{ 'l-credits--bulk': relevantPeople(role).length > 10}">
<div
v-for="person in relevantPeople(role)"
:key="person.name"
class="c-credit-entry"
>
{{ person.name }}
<span v-if="person.name2">
({{ person.name2 }})
</span>
</div>
</div>
</div>

<br><br><br><br><br><br><br><br><br>
<h1 class="c-credits-header">
Thank you so much for playing!
</h1>
</div>`
}
