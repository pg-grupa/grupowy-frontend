<script setup lang="ts">
import { store } from "@/state/store";
import { placeService } from "@/services/PlaceService";
import ReportBox from "./ReportBox.vue";
import { ref } from "vue";

function onCloseButton(): void {
  placeService.clearSelection();
}

const showReportBox = ref(false);

function toggleReportBox(): void {
  showReportBox.value = !showReportBox.value;
}
</script>

<template>
  <div id="placeInfo">
    <a class="close-button" @click="onCloseButton()">
      <font-awesome-icon icon="fa-solid fa-x" />
    </a>
    <h1>{{ store.selectedPlace!.name }}</h1>
    <div class="place-options">
      <button><font-awesome-icon icon="fa-solid fa-route" />Nawiguj</button>
      <button @click="toggleReportBox()">
        <font-awesome-icon icon="fa-solid fa-triangle-exclamation" />Zgłoś
      </button>
    </div>
    <hr />
    <div class="info-item">
      <h5 class="info-label">Rodzaj</h5>
      {{ store.selectedPlaceType!.name }}
    </div>
    <div class="info-item">
      <h5 class="info-label">Adres</h5>
      {{ store.selectedPlace!.addressStreet }},
      {{ store.selectedPlace!.addressPostalCode }}
      {{ store.selectedPlace!.addressCity }}
    </div>
    <div class="info-item">
      <h5 class="info-label">Właściciel</h5>
      {{ store.selectedPlace!.ownerName }}
    </div>
    <div class="info-item">
      <h5 class="info-label">Godziny otwarcia</h5>
      <table>
        <tr
          v-for="openHours in store.selectedPlace!.openHours"
          :key="openHours.day"
        >
          <td>{{ openHours.day }}</td>
          <td>{{ openHours.openHour }} - {{ openHours.closeHour }}</td>
        </tr>
      </table>
    </div>
    <div class="info-item">
      <h5 class="info-label">Usługi</h5>
      <table>
        <tr
          v-for="services in store.selectedPlace!.services"
          :key="services.name"
        >
          <td>{{ services.name }}</td>
          <td>{{ services.price }}</td>
        </tr>
      </table>
    </div>
  </div>
  <report-box
    v-if="showReportBox"
    :place="store.selectedPlace!"
    @close="toggleReportBox()"
  />
</template>

<style scoped>
#placeInfo {
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 500px;
  left: 50px;
  top: 150px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: var(--default-shadow);
  z-index: 1000;
  padding: 10px 20px;
}

h1 {
  font-size: 1.5rem;
}

.close-button {
  position: absolute;
  right: 15px;
  top: 10px;
  font-size: 1.3rem;
  z-index: 1001;
}

.place-options button {
  margin-right: 10px;
}

hr {
  border: none;
  border-bottom: 1px solid gray;
  margin: 10px 0;
}

.info-item {
  min-height: 40px;
  margin-bottom: 10px;
}

h5 {
  font-size: 0.9rem;
  margin-bottom: 0;
  padding-bottom: 0;
  line-height: 0.9rem;
  color: rgb(100, 100, 100);
}

table {
  width: 100%;
}

td {
  line-height: 1.3rem;
}
</style>
