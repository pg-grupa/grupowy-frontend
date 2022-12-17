import { createApp } from "vue";
import App from "./App.vue";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import {
  faFilter,
  faMagnifyingGlass,
  faMagnifyingGlassLocation,
  faBookBookmark,
  faFan,
  faUtensils,
  faMartiniGlassCitrus,
  faWrench,
  faMugHot,
  faMapLocation,
  faRuler,
  faX,
  faRoute,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(
  faFilter,
  faMagnifyingGlassLocation,
  faMagnifyingGlass,
  faBookBookmark,
  faFan,
  faUtensils,
  faMartiniGlassCitrus,
  faWrench,
  faMugHot,
  faMapLocation,
  faRuler,
  faX,
  faRoute,
  faTriangleExclamation
);
import "./assets/main.css";

createApp(App).component("font-awesome-icon", FontAwesomeIcon).mount("#app");
