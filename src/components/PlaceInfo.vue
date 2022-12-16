<script setup lang="ts">
import { store } from "@/state/store";
</script>

<template>
  <div id="placeInfo">
    <h1>{{ store.selectedPlace!.name }}</h1>
  </div>
</template>

<style scoped>
#placeInfo {
  position: fixed;
  width: 500px;
  left: 50px;
  top: 150px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: var(--default-shadow);
  z-index: 1000;
  padding: 20px;
}
</style>
