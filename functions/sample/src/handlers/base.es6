import voicelabsSdk from "voicelabs";
import fetch from "node-fetch";
import { WELCOME, RECIPES } from "../../data/speech";

const VoiceLabs = voicelabsSdk(process.env.VOICELABS_APP_TOKEN);
let recipes = RECIPES;

export const handler = {
    LaunchRequest() {
        this.emit("WelcomeIntent");
    },

    async WelcomeIntent() {
      let speech = WELCOME.speech;
      await VoiceLabs.track(this.event.session, "WelcomeIntent", null, speech),
      this.emit(":tell", speech);
    },

    async DrinkIntent() {
      let drink = this.event.request.intent.slots.drink.value;
      let speech;
      if (drink) {
        drink = drink.toLowerCase();
        if (recipes[drink]) {
          speech = recipes[drink];
        } else {
          speech = recipes["error"];
        }
      } else {
        speech = WELCOME.reprompt;
      }
      await VoiceLabs.track(this.event.session, "DrinkIntent", null, speech);
      this.emit(":tell", speech);
    }
};
