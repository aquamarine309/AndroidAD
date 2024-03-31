import { STUDY_TREE_LAYOUT_TYPE, TimeStudyTreeLayout } from "./time-study-tree-layout.js";

import DilationTimeStudy from "./DilationTimeStudy.js";
import ECTimeStudy from "./ECTimeStudy.js";
import EnslavedTimeStudy from "./EnslavedTimeStudy.js";
import HiddenTimeStudyConnection from "./HiddenTimeStudyConnection.js";
import NormalTimeStudy from "./NormalTimeStudy.js";
import PrimaryButton from "../../PrimaryButton.js";
import SecretTimeStudy from "./SecretTimeStudy.js";
import TimeStudyConnection from "./TimeStudyConnection.js";
import TriadTimeStudy from "./TriadTimeStudy.js";
import SliderComponent from "../../SliderComponent.js";
import TimeTheoremShop from "./TimeTheoremShop.js";
import TimeStudySaveLoadButton from "./TimeStudySaveLoadButton.js";

export default {
  name: "TimeStudiesTab",
  components: {
    PrimaryButton,
    NormalTimeStudy,
    ECTimeStudy,
    EnslavedTimeStudy,
    DilationTimeStudy,
    TriadTimeStudy,
    SecretTimeStudy,
    TimeStudyConnection,
    HiddenTimeStudyConnection,
    SliderComponent,
    TimeTheoremShop,
    TimeStudySaveLoadButton
  },
  data() {
    return {
      respec: player.respec,
      layoutType: STUDY_TREE_LAYOUT_TYPE.NORMAL,
      vLevel: 0,
      renderedStudyCount: 0,
      renderedConnectionCount: 0,
      isEnslaved: false,
      delayTimer: 0,
      scale: 1,
      initialDistance: 0,
      currentDistance: 0
    };
  },
  computed: {
    layout() {
      return TimeStudyTreeLayout.create(this.layoutType);
    },
    allStudies() {
      return this.layout.studies;
    },
    studies() {
      return this.allStudies.slice(0, this.renderedStudyCount);
    },
    allConnections() {
      return this.layout.connections;
    },
    connections() {
      return this.allConnections.slice(0, this.renderedConnectionCount);
    },
    treeStyleObject() {
      return {
        width: `${this.layout.width}rem`,
        height: `${this.layout.height}rem`
      };
    },
    respecClassObject() {
      return {
        "o-primary-btn--respec": true,
        "o-primary-btn--respec-active": this.respec
      };
    },
    zoomStyle() {
      return {
        transform: `scale(${this.scale})`
      }
    },
    sliderProps() {
      return {
        min: 0.3,
        max: 1,
        interval: 0.035,
        width: "100%",
        tooltip: false
      }
    }
  },
  watch: {
    respec(newValue) {
      player.respec = newValue;
    },
    vLevel() {
      // When vLevel changes, we recompute the study tree because of triad studies
      this.$recompute("layout");
    },
    scale(newValue) {
      player.timestudy.scale = newValue;
    }
  },
  created() {
    const incrementRenderedCount = () => {
      let shouldRequestNextFrame = false;
      if (this.renderedStudyCount < this.allStudies.length) {
        this.renderedStudyCount += 2;
        shouldRequestNextFrame = true;
      }
      if (this.renderedConnectionCount < this.allConnections.length) {
        this.renderedConnectionCount += 2;
        shouldRequestNextFrame = true;
      }
      if (shouldRequestNextFrame) {
        this.renderAnimationId = requestAnimationFrame(incrementRenderedCount);
      }
    };
    incrementRenderedCount();

    // CSS controlling the fade in/out for the Enslaved study is an animation happening over the course of 1 second.
    // Removing it normally via key-switching ends up getting rid of it immediately without animating, which we do if it
    // wasn't purchased - otherwise it animates to the unbought state and then remove it after the animation finishes.
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, () => {
      this.delayTimer = player.celestials.enslaved.hasSecretStudy ? Date.now() : 0;
    });

    // Scroll to top because time studies tab is rendered progressively
    // and we don't want the player to see empty space while it's loading.
    document.body.scrollTop = 0;
  },
  beforeDestroy() {
    cancelAnimationFrame(this.renderAnimationId);
  },
  methods: {
    update() {
      this.respec = player.respec;
      this.layoutType = STUDY_TREE_LAYOUT_TYPE.current;
      this.vLevel = Ra.pets.v.level;
      this.isEnslaved = Enslaved.isRunning || Date.now() - this.delayTimer < 1000;
      this.scale = player.timestudy.scale;
    },
    studyComponent(study) {
      switch (study.type) {
        case TIME_STUDY_TYPE.NORMAL:
          return NormalTimeStudy;
        case TIME_STUDY_TYPE.ETERNITY_CHALLENGE:
          return ECTimeStudy;
        case TIME_STUDY_TYPE.DILATION:
          return DilationTimeStudy;
        case TIME_STUDY_TYPE.TRIAD:
          return TriadTimeStudy;
      }
      throw "Unknown Time Study type";
    },
    exportStudyTree() {
      if (player.timestudy.studies.length === 0) {
        GameUI.notify.error("You cannot export an empty Time Study Tree!");
      } else {
        copyToClipboard(GameCache.currentStudyTree.value.exportString);
        GameUI.notify.info("Exported current Time Studies to your clipboard");
      }
    },
    adjustSliderValue(value) {
      this.scale = value;
    },
  },
  template: `
  <div class="l-time-studies-tab">
    <div class="c-subtab-option-container">
      <TimeTheoremShop />
      <div class="l-time-studies-tab-row">
      <PrimaryButton
        :class="respecClassObject"
        @click="respec = !respec"
      >
        Respec Time Studies on next Eternity
      </PrimaryButton>
      </div>
      <div class="l-time-studies-tab-row">
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="exportStudyTree"
      >
        Export tree
      </PrimaryButton>
      <PrimaryButton
        class="o-primary-btn--subtab-option o-primary-btn--subtab-option--small"
        onclick="Modal.preferredTree.show()"
      >
        Show preferred
        <br>
        paths
      </PrimaryButton>
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        onclick="Modal.studyString.show({ id: -1 })"
      >
        Import tree
      </PrimaryButton>
      </div>
      <div class="l-time-studies-tab-row">
        <TimeStudySaveLoadButton
          v-for="saveslot in 6"
          :key="saveslot"
          :saveslot="saveslot"
        />
      </div>
      <div class="o-time-study-slider-container">
      <span>Zoom: </span>
      <SliderComponent
        v-bind="sliderProps"
        class="l-time-study-slider"
        :value="scale"
        @input="adjustSliderValue($event)"
      />
    </div>
    </div>
    <div class="l-studies-container">
    <div
    class="l-studies-scale-container"
    :style="zoomStyle"
    >
    <div
      class="l-time-study-tree l-time-studies-tab__tree"
      :style="treeStyleObject"
    >
      <component
        :is="studyComponent(setup.study)"
        v-for="(setup) in studies"
        :key="setup.study.type.toString() + setup.study.id.toString()"
        :setup="setup"
      />
      <SecretTimeStudy :setup="layout.secretStudy" />
      <EnslavedTimeStudy
        v-if="isEnslaved"
        :setup="layout.enslavedStudy"
      />
      <svg
        :style="treeStyleObject"
        class="l-time-study-connection"
      >
        <TimeStudyConnection
          v-for="(setup, index) in connections"
          :key="'connection' + index"
          :setup="setup"
        />
        <HiddenTimeStudyConnection :setup="layout.secretStudyConnection" />
        <HiddenTimeStudyConnection
          v-if="isEnslaved"
          :setup="layout.enslavedStudyConnection"
          :is-enslaved="isEnslaved"
        />
      </svg>
    </div>
    </div>
    </div>
  </div>
  `
}