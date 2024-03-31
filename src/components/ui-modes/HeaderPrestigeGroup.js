import HeaderCenterContainer from "./prestige-header/HeaderCenterContainer.js";
import HeaderEternityContainer from "./prestige-header/HeaderEternityContainer.js";
import HeaderInfinityContainer from "./prestige-header/HeaderInfinityContainer.js";

export default {
name: "HeaderPrestigeGroup",
components: {
HeaderCenterContainer,
HeaderEternityContainer,
HeaderInfinityContainer,
},
template: `<div class="c-prestige-info-blocks">
<HeaderCenterContainer class="l-game-header__center" />
</div>`
}
