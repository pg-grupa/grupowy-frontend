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
  padding-left: 20px;
  border-radius: 15px;
  font-size: 1.4rem;
  line-height: 50px;
  background-color: #ffffff;
  box-shadow: var(--defaul-shadow);
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
  box-shadow: var(--defaul-shadow);
}

button.toggled {
  background-color: rgba(58, 58, 58, 1);
  color: #ffffff;
}
</style>
