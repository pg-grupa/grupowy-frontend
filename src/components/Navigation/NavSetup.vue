<script setup lang="ts">
import { exitMode, store } from "@/state/store";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import type { SearchResult } from "leaflet-geosearch/dist/providers/provider";
import { ref, onMounted, type Ref } from "vue";

const emit = defineEmits<{
  (e: "startNavigation"): void;
  (e: "modeChanged"): void;
  (e: "routeChanged"): void;
}>();

const startResults: Ref<SearchResult[] | null> = ref(null);
const showStartResults = ref(false);
const searchQuery = ref("");
const routeEnd = ref("");

let timeout: number | undefined;

const provider = new OpenStreetMapProvider({
  params: {
    "accept-language": "pl", // render results in Dutch
    countrycodes: "pl", // limit search results to the Netherlands
  },
});

function onStartChange() {
  clearTimeout(timeout);
  timeout = setTimeout(onStartSearch, 1000);
}

function onStartSearch() {
  provider
    .search({ query: searchQuery.value })
    .then((response) => {
      startResults.value = response;
      showStartResults.value = true;
    })
    .catch(console.error);
}

function onStartResultSelected(result: SearchResult) {
  startResults.value = null;
  showStartResults.value = false;
  searchQuery.value = result.label;
  store.routeStart = {
    name: result.label,
    location: [result.y, result.x],
  };
  emit("routeChanged");
}

function onCloseButton(): void {
  store.routeStart = null;
  exitMode();
  emit("modeChanged");
}

function setToLocation() {
  if (store.myLocation) {
    store.routeStart = {
      name: "Moja lokalizacja",
      location: store.myLocation,
    };
    searchQuery.value = "Moja lokalizacja";
    emit("routeChanged");
  }
}

function startNavigation() {
  if (store.routeStart && store.routeEnd) {
    emit("startNavigation");
  }
}

onMounted(() => {
  routeEnd.value = store.routeEnd!.name;
  if (store.routeStart) {
    searchQuery.value = store.routeStart.name;
  }
  emit("modeChanged");
});
</script>

<template>
  <div id="navSetup" class="flex-col container">
    <a class="close-button" @click="onCloseButton()">
      <i class="fa-solid fa-x" />
    </a>
    <h3>Nawiguj do obiektu</h3>
    <div class="input-group">
      <div class="input-icon">
        <i class="fa-solid fa-location-dot" />
      </div>
      <input
        type="text"
        placeholder="Adres początkowy"
        v-model="searchQuery"
        @input="onStartChange"
      />
      <button
        id="locationButton"
        @click="setToLocation"
        v-if="store.myLocation"
      >
        <i class="fa-solid fa-location-crosshairs"></i>
      </button>
    </div>
    <div class="input-group">
      <div class="input-icon">
        <i class="fa-solid fa-flag-checkered" />
      </div>
      <input
        type="text"
        placeholder="Adres końcowy"
        v-model="routeEnd"
        disabled
      />
    </div>
    <div class="nav-footer flex-row">
      <button @click="startNavigation" class="icon-button">
        <i class="fa-solid fa-route" />Nawiguj
      </button>
    </div>
  </div>

  <div id="startSearchResults" v-if="showStartResults">
    <template v-if="startResults && startResults.length">
      <a
        class="search-result"
        v-for="result in startResults"
        :key="result.label"
        @click="onStartResultSelected(result)"
      >
        <h4>{{ result.label }}</h4>
      </a>
    </template>
    <template v-else>
      <h3>Brak wyników.</h3>
      <a class="search-result" @click="showStartResults = false">Zamknij</a>
    </template>
  </div>
</template>

<style scoped>
#navSetup {
  position: fixed;
  width: 400px;
  left: 50px;
  top: 50px;
  z-index: 1000;
}

.close-button {
  position: absolute;
  right: 15px;
  top: 10px;
  font-size: 1.3rem;
  z-index: 1001;
}

h3 {
  text-align: center;
  margin-bottom: 20px;
}

#locationButton {
  margin-left: 0.5rem;
  font-size: 1.2rem;
}

#startSearchResults {
  position: fixed;
  width: 500px;
  left: 50px;
  top: 150px;
  max-height: 500px;
  overflow-y: auto;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: var(--default-shadow);
  z-index: 2000;
  padding: 20px 0;
}

.search-result {
  display: block;
  cursor: pointer;
  padding: 5px 20px;
}

.nav-footer {
  justify-content: flex-end;
}
</style>
