<script setup lang="ts">
import { ref } from "vue";
import AdvancedSearch from "./AdvancedSearch.vue";
import FiltersBox from "./FiltersBox.vue";
import { store } from "@/state/store";

const searchQuery = ref("");
const showAdvancedSearch = ref(false);
const showFilters = ref(false);

function onSearch() {
  console.log(searchQuery.value); // TODO: send search request
}

function toggleAdvancedSearch() {
  showFilters.value = false; // hide filters
  showAdvancedSearch.value = !showAdvancedSearch.value; // toggle advanced search
}

function toggleFilters() {
  showFilters.value = !showFilters.value; // toggle filters
  showAdvancedSearch.value = false; // hide advanced search
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
        <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
      </button>
      <button
        type="button"
        :class="{ toggled: showFilters }"
        @click="toggleFilters()"
      >
        <font-awesome-icon icon="fa-solid fa-filter" />
      </button>
      <button
        type="button"
        :class="{ toggled: showAdvancedSearch && !store.hideSearchInterface }"
        @click="toggleAdvancedSearch()"
      >
        <font-awesome-icon icon="fa-solid fa-magnifying-glass-location" />
      </button>
    </form>
  </div>
  <advanced-search v-if="showAdvancedSearch && !store.hideSearchInterface" />
  <filters-box v-if="showFilters && !store.hideSearchInterface" />
</template>

<style scoped>
#searchBar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
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
