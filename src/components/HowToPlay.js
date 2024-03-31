export default {
name: "HowToPlay",
data() {
return {
hasTutorial: false,
isModern: false,
};
},
computed: {
h2pClassObject() {
return {
"o-tab-btn l-help-me": true,
};
},
topMargin() {
return {
"margin-top": this.isModern ? "4.5rem" : "1rem",
};
}
},
methods: {
update() {
this.hasTutorial = Tutorial.emphasizeH2P();
this.isModern = player.options.newUI;
},
showH2P() {
Modal.h2p.show();
},
showInfo() {
Modal.information.show();
}
},
template: `<div>
<div
:class="h2pClassObject"
:style="topMargin"
@click="showH2P"
>
?
<div
v-if="hasTutorial"
class="h2p-tooltip"
>
Click for info
</div>
</div>
<div
v-if="hasTutorial"
class="h2p-tutorial--glow"
:style="topMargin"
/>
<div
class="o-tab-btn l-information l-help-me"
@click="showInfo"
>
i
</div>
</div>`
}