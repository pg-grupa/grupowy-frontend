<script setup lang="ts">
import type { PlaceType } from "@/models/PlaceType";
import { placeService } from "@/services/PlaceService";
import { store } from "@/state/store";
import { onUnmounted } from "vue";

const emit = defineEmits<{
  (e: "filterChanged"): void;
}>();

const placeTypes = store.placeTypes;

function selectType(placeType: PlaceType) {
  // toggle selection of place type
  placeService.toggleTypeSelection(placeType);
  emit("filterChanged");
}

onUnmounted(() => {
  // store.selectedFilterType = null;
});
</script>

<template>
  <div id="filtersBox">
    <h2><i class="fa-solid fa-filter" /><span>Filtry</span></h2>
    <hr />
    <div class="place-types">
      <template v-for="placeType in placeTypes" :key="placeType">
        <a
          class="type-container"
          :class="{ selected: store.selectedFilterType === placeType }"
          @click="selectType(placeType)"
        >
          <i :class="'fa-solid ' + placeType.icon" />
          <h3 class="type-name">{{ placeType.name }}</h3>
        </a>
      </template>
    </div>
  </div>
</template>

<style scoped>
#filtersBox {
  position: fixed;
  width: 350px;
  left: 50px;
  top: 150px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: var(--default-shadow);
  z-index: 1000;
  padding: 20px;
}

h2 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

h2 > span {
  margin-left: 0.5rem;
}

hr {
  border: none;
  border-top: 1px solid #c2c2c2;
  margin-bottom: 0.5rem;
}

.place-types {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0.5rem;
}

.place-types > * {
  flex: 0 0 45%;
  /* margin: 1rem 1.5rem 0 0; */
  margin-bottom: 1rem;
}

.type-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4eded;
  height: 45px;
  padding: 10px;
  box-shadow: var(--small-shadow);
  border-radius: 5px;
  text-decoration: none;
}

.type-container.selected {
  background-color: #3a3a3a;
  color: #ffffff;
}

.type-name {
  font-size: 0.8rem;
  margin-left: 0.5rem;
  flex-grow: 1;
  text-align: center;
}
</style>
