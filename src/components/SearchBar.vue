<script setup lang="ts">
import { ref } from "vue";

const searchQuery = ref("");
const showAdvancedSearch = ref(false);
const showFilters = ref(false);

function onSearch() {
  console.log(searchQuery.value); // TODO: send search request
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
      <button
        type="button"
        :class="{ toggled: showFilters }"
        @click="showFilters = !showFilters"
      >
        <font-awesome-icon icon="fa-solid fa-filter" />
      </button>
      <button
        type="button"
        :class="{ toggled: showAdvancedSearch }"
        @click="showAdvancedSearch = !showAdvancedSearch"
      >
        <font-awesome-icon icon="fa-solid fa-magnifying-glass-location" />
      </button>
    </form>
  </div>
</template>

<style scoped>
#searchBar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 600px;
  z-index: 1000;
  padding: 1rem;
  padding-left: 60px;
}

form {
  display: flex;
  flex-direction: row;
  width: 100%;
}

form > * {
  margin-right: 10px;
}

input {
  width: 100%;
  border: none;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-size: 1.2rem;
  box-shadow: var(--defaul-shadow);
}

button {
  border: none;
  padding: 0.5rem 0.6rem;
  border-radius: 9999px;
  font-size: 1.2rem;
  background-color: #ffffff;
  box-shadow: var(--defaul-shadow);
}

button.toggled {
  background-color: rgb(39, 39, 39);
  color: #ffffff;
}
</style>
