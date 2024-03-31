import FailableEcText from "./FailableEcText.js";
import PrimaryButton from "../PrimaryButton.js";

export default {
  name: "HeaderChallengeDisplay",
  components: {
    FailableEcText,
    PrimaryButton
  },
  data() {
    return {
      activityTokens: [],
      infinityUnlocked: false,
      showExit: false,
      resetCelestial: false,
      inPelle: false,
    };
  },
  computed: {
    parts() {
      // We need activityToken for NC/IC/EC because plain check of WhateverChallenge.isRunning
      // won't trigger display update if we, say, switch from one challenge to another
      function celestialReality(celestial, name, tab) {
        return {
          name: () => `${name} Reality`,
          isActive: token => token,
          activityToken: () => celestial.isRunning,
          tabName: () => tab,
        };
      }
      return [
      celestialReality(Teresa, "Teresa's", "teresa"),
      celestialReality(Effarig, "Effarig's", "effarig"),
      celestialReality(Enslaved, "The Nameless Ones'", "enslaved"),
      celestialReality(V, "V's", "v"),
      celestialReality(Ra, "Ra's", "ra"),
      celestialReality(Laitela, "Lai'tela's", "laitela"), {
        name: () => "Time Dilation",
        isActive: token => token,
        activityToken: () => player.dilation.active
      }, {
        name: token => `Eternity Challenge ${token}`,
        isActive: token => token > 0,
        activityToken: () => player.challenge.eternity.current
      }, {
        name: token => `Infinity Challenge ${token}`,
        isActive: token => token > 0,
        activityToken: () => player.challenge.infinity.current
      }, {
        name: token => `Normal Challenge ${token}`,
        isActive: token => token > 0,
        activityToken: () => player.challenge.normal.current
      }, ];
    },
    activeChallengeNames() {
      const names = [];
      for (let i = 0; i < this.activityTokens.length; i++) {
        const token = this.activityTokens[i];
        const part = this.parts[i];
        if (!part.isActive(token)) continue;
        if (part.name(token).includes("Eternity Challenge")) {
          const currEC = player.challenge.eternity.current;
          const nextCompletion = EternityChallenge(currEC)
            .completions + 1;
          let completionText = "";
          if (Enslaved.isRunning && currEC === 1) {
            completionText = `(${formatInt(nextCompletion)}/???)`;
          } else if (nextCompletion === 6) {
            completionText = `(already completed)`;
          } else {
            completionText = `(${formatInt(nextCompletion)}/${formatInt(5)})`;
          }
          names.push(`${part.name(token)} ${completionText}`);
        } else {
          names.push(part.name(token));
        }
      }
      return names;
    },
    isVisible() {
      return this.infinityUnlocked || this.activeChallengeNames.length > 0;
    },
    isInFailableEC() {
      return this.activeChallengeNames.some(str => str.match(/Eternity Challenge (4|12)/gu));
    },
    challengeDisplay() {
      if (this.inPelle && this.activeChallengeNames.length > 0) {
        return `${this.activeChallengeNames.join(" + ")} in a Doomed Reality. Good luck.`;
      }
      if (this.inPelle) return "a Doomed Reality. Good luck.";
      if (this.activeChallengeNames.length === 0) {
        return "the Antimatter Universe";
      }
      return this.activeChallengeNames.join(" + ");
    },
  },
  methods: {
    update() {
      this.infinityUnlocked = PlayerProgress.infinityUnlocked();
      this.activityTokens = this.parts.map(part => part.activityToken());
      // Dilation in Pelle can't be left once entered, but we still want to allow leaving more nested challenges
      this.showExit = this.inPelle && player.dilation.active ? this.activeChallengeNames.length > 1 : this.activeChallengeNames.length !== 0;
      this.resetCelestial = player.options.retryCelestial;
      this.inPelle = Pelle.isDoomed;
    },
    // Bring the player to the tab related to the innermost challenge
    textClicked() {
      if (this.activeChallengeNames.length === 0) return;

      // Iterating back-to-front and breaking ensures we get the innermost restriction
      let fullName = "", celestial = "";
      for (let i = this.activityTokens.length - 1; i >= 0; i--) {
        const token = this.activityTokens[i];
        const part = this.parts[i];
        if (!part.isActive(token)) continue;
        fullName = part.name(token);
        celestial = part.tabName?.();
        break;
      }

      // Normal challenges are matched with an end-of-string metacharacter
      if (fullName.match("Normal Challenge")) Tab.challenges.normal.show(true);
      else if (fullName.match("Infinity Challenge")) Tab.challenges.infinity.show(true);
      else if (fullName.match("Eternity Challenge")) Tab.challenges.eternity.show(true);
      else if (player.dilation.active) Tab.eternity.dilation.show(true);
      else Tab.celestials[celestial].show(true);
    },
    textClassObject() {
      return {
        "l-challenge-display": true,
        "l-challenge-display--clickable": this.activeChallengeNames.length !== 0,
      };
    }
  },
  template: `<div
v-if="isVisible"
class="l-game-header__challenge-text c-info-color"
>
<span
:class="textClassObject()"
@click="textClicked"
>
You are currently in {{ challengeDisplay }}
</span>
<FailableEcText v-if="isInFailableEC" />
<span class="l-padding-line" />
</div>`
}