
export default {
name: "InformationModalButton",
props: {
name: {
type: String,
required: true
},
icon: {
type: String,
required: true
},
link: {
type: String,
required: false,
default: null
},
showModal: {
type: String,
required: false,
default: null
},
},
methods: {
openAssociatedModal() {
Modal[this.showModal].show();
}
},
template: `<span
:ach-tooltip="name"
class="c-socials--icon__wrapper"
>
<a
v-if="link"
class="c-socials--icon"
>
<i :class="icon" />
</a>
<a
v-else
class="c-socials--icon"
@click="openAssociatedModal"
>
<i :class="icon" />
</a>
</span>`
}
