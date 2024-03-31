import HoverMenu from "./HoverMenu.js";

export default {
  name: "TimeStudySaveLoadButton",
  components: {
    HoverMenu,
  },
  props: {
    saveslot: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      name: "",
      displayName: "",
      canEternity: false
    };
  },
  computed: {
    preset() {
      return player.timestudy.presets[this.saveslot - 1];
    },
  },
  methods: {
    update() {
      this.name = player.timestudy.presets[this.saveslot - 1].name;
      this.displayName = this.name === "" ? this.saveslot : this.name;
      this.canEternity = Player.canEternity;
    },
    nicknameBlur(event) {
      const newName = event.target.value.slice(0, 4)
        .trim();
      if (!this.isASCII(newName)) return;

      const existingNames = player.timestudy.presets.map(p => p.name);
      if (existingNames.includes(newName)) return;

      this.preset.name = newName;
      this.name = this.preset.name;
    },
    hideContextMenu() {
      this.$viewModel.currentContextMenu = null;
    },
    // This is largely done because of UI reasons - there is no Unicode specification for character width, which means
    // that arbitrary Unicode inputs can allow for massive text overflow
    isASCII(input) {
      // eslint-disable-next-line no-control-regex
      return !/[^\u0000-\u00ff]/u.test(input);
    },
    save() {
      this.hideContextMenu();
      this.preset.studies = GameCache.currentStudyTree.value.exportString;
      const presetName = this.name ? `Study preset "${this.name}"` : "Study preset";
      GameUI.notify.info(`${presetName} saved in slot ${this.saveslot}`);
    },
    load() {
      this.hideContextMenu();
      if (this.preset.studies) {
        // We need to use a combined tree for committing to the game state, or else it won't buy studies in the imported
        // tree are only reachable if the current tree is already bought
        const combinedTree = new TimeStudyTree();
        combinedTree.attemptBuyArray(TimeStudyTree.currentStudies, false);
        combinedTree.attemptBuyArray(combinedTree.parseStudyImport(this.preset.studies), true);
        TimeStudyTree.commitToGameState(combinedTree.purchasedStudies, false, combinedTree.startEC);

        const presetName = this.name ? `Study preset "${this.name}"` : "Study preset";
        GameUI.notify.info(`${presetName} loaded from slot ${this.saveslot}`);
      } else {
        Modal.message.show("This Time Study list currently contains no Time Studies.");
      }
    },
    respecAndLoad() {
      if (Player.canEternity) {
        player.respec = true;
        const newTree = new TimeStudyTree();
        newTree.attemptBuyArray(newTree.parseStudyImport(this.preset.studies));
        animateAndEternity(() => TimeStudyTree.commitToGameState(newTree.purchasedStudies, false, newTree.startEC));
      }
    },
    deletePreset() {
      this.hideContextMenu();
      if (this.preset.studies) Modal.studyString.show({
        id: this.saveslot - 1,
        deleting: true
      });
      else Modal.message.show("This Time Study list currently contains no Time Studies.");
    },
    handleExport() {
      this.hideContextMenu();
      copyToClipboard(this.preset.studies);
      const presetName = this.name ? `Study preset "${this.name}"` : "Study preset";
      GameUI.notify.info(`${presetName} exported from slot ${this.saveslot} to your clipboard`);
    },
    edit() {
      Modal.studyString.show({
        id: this.saveslot - 1
      });
    },
    rename() {
      Modal.studyRename.show({
        id: this.saveslot - 1
      });
    }
  },
  template: `
  <HoverMenu class="l-tt-save-load-btn__wrapper">
    <template #object>
      <button
        class="l-tt-save-load-btn"
        @click="load"
      >
        {{ displayName }}
      </button>
    </template>
    <template #menu>
      <div
        class="l-tt-save-load-btn__menu c-tt-save-load-btn__menu"
        @touchstart.stop
      >
        <div
          class="l-tt-save-load-btn__menu-item c-tt-save-load-btn__menu-item"
          @click.stop="rename"
        >
          Rename
        </div>
        <div
          class="l-tt-save-load-btn__menu-item c-tt-save-load-btn__menu-item"
          @click.stop="edit"
        >
          Edit
        </div>
        <div
          class="l-tt-save-load-btn__menu-item c-tt-save-load-btn__menu-item"
          @click.stop="handleExport"
        >
          Export
        </div>
        <div
          class="l-tt-save-load-btn__menu-item c-tt-save-load-btn__menu-item"
          @click.stop="save"
        >
          Save
        </div>
        <div class="l-tt-save-load-btn__menu-item">
          <div
            class="c-tt-save-load-btn__menu-item"
            @click.stop="load"
          >
            Load
          </div>
          <div class="c-tt-save-load-btn__menu-item__hover-options">
            <div
            :class="{
              'c-tt-save-load-btn__menu-item__hover-option': true,
              'c-tt-save-load-btn__menu-item__hover-option--disabled': !canEternity,
            }"
              @click.prevent="respecAndLoad"
            >
              Respec and Load
            </div>
          </div>
        </div>
        <div
          class="l-tt-save-load-btn__menu-item c-tt-save-load-btn__menu-item"
          @click.prevent="deletePreset"
        >
          Delete
        </div>
      </div>
    </template>
  </HoverMenu>
  `
}