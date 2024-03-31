import ModalWrapper from "../ModalWrapper.js";
import S12GameEntries from "./S12GameEntries.js";

import S12Games from "./s12-games.js";

export default {
name: "S12GamesModal",
components: {
ModalWrapper,
S12GameEntries,
},
data() {
return {
S12Games,
};
},
methods: {
update() {
if (this.$viewModel.theme !== "S12") EventHub.dispatch(GAME_EVENT.CLOSE_MODAL);
}
},
template: `<ModalWrapper class="c-modal-s12-games">
<div class="c-modal__title">
Games
</div>
<S12GameEntries />
<div class="c-modal-s12-games__magnified-display">
<template v-if="S12Games.selected !== -1">
<img
class="c-modal-s12-games__magnified-display__img"
:src="`images/s12/${S12Games.entries[S12Games.selected].image}`"
>
<b class="c-modal-s12-games__magnified-display__text">
{{ S12Games.entries[S12Games.selected].name }}
</b>
</template>
</div>
</ModalWrapper>`
}
