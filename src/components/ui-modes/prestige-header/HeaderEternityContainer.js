import EternityButton from "./EternityButton.js";
import UnlockInfinityDimButton from "./UnlockInfinityDimButton.js";

export default {
name: "HeaderEternityContainer",
components: {
EternityButton,
UnlockInfinityDimButton,
},
data() {
return {
showContainer: false
};
},
methods: {
update() {
this.showContainer = player.break;
},
},
template: `<div
v-if="showContainer"
class="c-prestige-button-container c-eternity-button-container"
>
<UnlockInfinityDimButton />
<EternityButton />
</div>`
}