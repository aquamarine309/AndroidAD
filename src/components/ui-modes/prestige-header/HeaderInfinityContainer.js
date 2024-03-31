import BigCrunchButton from "./BigCrunchButton.js";

export default {
name: "HeaderInfinityContainer",
components: {
BigCrunchButton,
},
data() {
return {
showContainer: false
};
},
methods: {
update() {
this.showContainer = player.break;
}
},
template: `<div
v-if="showContainer"
class="c-prestige-button-container c-infinity-button-container"
>
<BigCrunchButton />
</div>`
}