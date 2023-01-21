<script setup lang="ts">
import { ref, type Ref } from "vue";
import AdvancedSearch from "./AdvancedSearch.vue";
import FiltersBox from "./FiltersBox.vue";
import { store, Mode, changeMode, exitMode } from "@/state/store";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import type { SearchResult } from "leaflet-geosearch/dist/providers/provider";

const emit = defineEmits<{
  (e: "modeChanged"): void;
  (e: "filterChanged"): void;
  (e: "changeView", center: [number, number]): void;
}>();

const results: Ref<SearchResult[] | null> = ref(null);
const showResults = ref(false);
const searchQuery = ref("");
const provider = new OpenStreetMapProvider({
  params: {
    "accept-language": "pl", // render results in Polish
    countrycodes: "pl", // limit search results to the Poland
  },
});

let timeout: number | undefined;

function onSearchChange() {
  clearTimeout(timeout);
  timeout = setTimeout(onSearch, 1000);
}

function onSearch() {
  provider
    .search({ query: searchQuery.value })
    .then((response) => {
      results.value = response;
      showResults.value = true;
    })
    .catch(console.error);
}

function onResultSelected(result: SearchResult) {
  results.value = null;
  showResults.value = false;
  emit("changeView", [result.y, result.x]);
}

function toggleAdvancedSearch() {
  if (store.appMode == Mode.Filter) exitMode();
  if (store.appMode == Mode.Search) {
    exitMode();
  } else {
    store.loadedPlaces = [];
    changeMode(Mode.Search);
  }
  emit("modeChanged");
}

function onChangeView(center: [number, number]) {
  emit("changeView", center);
}

function toggleFilters() {
  if (store.appMode == Mode.Search) exitMode();
  if (store.appMode == Mode.Filter) {
    exitMode();
  } else {
    changeMode(Mode.Filter);
  }
  emit("modeChanged");
}
</script>

<template>
  <div id="searchBar">
    <form @submit.prevent="onSearch">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Szukaj"
        autocomplete="off"
        spellcheck="false"
        @input="onSearchChange"
      />
      <button id="submitButton" type="submit">
        <i class="fa-solid fa-magnifying-glass" />
      </button>
      <button
        type="button"
        :class="{ toggled: store.appMode == Mode.Filter }"
        @click="toggleFilters()"
      >
        <i class="fa-solid fa-filter" />
      </button>
      <button
        type="button"
        :class="{ toggled: store.appMode == Mode.Search }"
        @click="toggleAdvancedSearch()"
      >
        <i class="fa-solid fa-magnifying-glass-location" />
      </button>
    </form>
  </div>
  <div id="searchResults" v-if="showResults">
    <template v-if="results && results.length">
      <a
        class="search-result"
        v-for="result in results"
        :key="result.label"
        @click="onResultSelected(result)"
      >
        <h4>{{ result.label }}</h4>
      </a>
    </template>
    <template v-else>
      <h3>Brak wyników.</h3>
      <a class="search-result" @click="showResults = false">Zamknij</a>
    </template>
  </div>
  <advanced-search
    v-if="store.appMode == Mode.Search"
    @change-view="onChangeView"
    @advanced-filter-changed="emit('filterChanged')"
  />
  <filters-box
    v-if="store.appMode == Mode.Filter"
    @filter-changed="emit('filterChanged')"
  />
</template>

<style scoped>
#searchBar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 800px;
  z-index: 1000;
  padding: 50px 50px 0;
}

form {
  display: flex;
  flex-direction: row;
  width: 100%;
}

form > * {
  margin-right: 20px;
}

input {
  width: 100%;
  max-width: 500px;
  height: 50px;
  border: none;
  padding-left: 50px;
  border-radius: 15px;
  font-size: 1.4rem;
  line-height: 50px;
  background-color: #ffffff;
  box-shadow: var(--default-shadow);
}

button {
  flex-shrink: 0;
  height: 50px;
  width: 50px;
  border: none;
  border-radius: 9999px;
  font-size: 1.6rem;
  line-height: 50px;
  background-color: #ffffff;
  box-shadow: var(--default-shadow);
  cursor: pointer;
  padding: 0;
}

button.toggled {
  background-color: #3a3a3a;
  color: #ffffff;
}

#submitButton {
  position: absolute;
  left: 0;
  background: transparent;
  box-shadow: none;
  color: rgba(58, 58, 58, 1);
}

#searchResults {
  position: fixed;
  width: 500px;
  left: 50px;
  top: 120px;
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

.search-result:hover {
  background-color: rgb(194, 194, 194);
}
</style>
