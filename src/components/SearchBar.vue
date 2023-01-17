<script setup lang="ts">
import { ref } from "vue";
import AdvancedSearch from "./AdvancedSearch.vue";
import FiltersBox from "./FiltersBox.vue";
import { store, Mode, changeMode, exitMode } from "@/state/store";
import { placeService } from "@/services/PlaceService";

const emit = defineEmits<{
  (e: "modeChanged"): void;
  (e: "filterChanged"): void;
}>();

const searchQuery = ref("");

function onSearch() {
  console.log(searchQuery.value); // TODO: send search request
}

function toggleAdvancedSearch() {
  if (store.appMode == Mode.Filter) exitMode();
  if (store.appMode == Mode.Search) {
    exitMode();
  } else {
    changeMode(Mode.Search);
  }
  emit("modeChanged");
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
  <advanced-search v-if="store.appMode == Mode.Search" />
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
</style>
