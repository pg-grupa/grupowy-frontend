<script setup lang="ts">
import { Mode, store } from "@/state/store";
import { placeService } from "@/services/PlaceService";
import ReportBox from "./ReportBox.vue";
import { ref, type Ref } from "vue";
import { Api } from "@/services/ApiService";

function onCloseButton(): void {
  if (store.appMode == Mode.Navigation) {
    store.appMode = Mode.Info;
  }
  placeService.clearSelection();
}

const showReportBox = ref(false);

function toggleReportBox(): void {
  showReportBox.value = !showReportBox.value;
}

function navigate() {
  const stop: [number, number] = [
    store.selectedPlace!.latitude,
    store.selectedPlace!.longitude,
  ];
}

const dayNames: { [key: string]: string } = {
  Monday: "Poniedziałek",
  Tuesday: "Wtorek",
  Wednesday: "Środa",
  Thursday: "Czwartek",
  Friday: "Piątek",
  Saturday: "Sobota",
  Sunday: "Niedziela",
};
</script>

<template>
  <div id="placeInfo">
    <a class="close-button" @click="onCloseButton()">
      <i class="fa-solid fa-x" />
    </a>
    <h1>{{ store.selectedPlace!.name }}</h1>
    <div class="place-options">
      <button @click="navigate()">
        <i class="fa-solid fa-route" />Nawiguj
      </button>
      <button @click="toggleReportBox()">
        <i class="fa-solid fa-triangle-exclamation" />Zgłoś
      </button>
    </div>
    <hr />
    <div class="info-item">
      <h5 class="info-label">Rodzaj</h5>
      {{ store.selectedPlaceType!.name }}
    </div>
    <div class="info-item">
      <h5 class="info-label">Adres</h5>
      {{ store.selectedPlace!.address }}
    </div>
    <div class="info-item">
      <h5 class="info-label">Właściciel</h5>
      {{ store.selectedPlace!.owner }}
    </div>
    <div class="info-item">
      <h5 class="info-label">Telefon</h5>
      {{ store.selectedPlace!.phone }}
    </div>
    <div class="info-item">
      <h5 class="info-label">Godziny otwarcia</h5>
      <table>
        <template
          v-for="openHours, day in store.selectedPlace!.openHours"
          :key="day"
        >
          <tr v-if="openHours">
            <td>{{ dayNames[day] }}</td>
            <td>{{ openHours.from }} - {{ openHours.to }}</td>
          </tr>
        </template>
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
