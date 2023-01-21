<script setup lang="ts">
import { Mode, store } from "@/state/store";
import { placeService } from "@/services/PlaceService";
import ReportBox from "./ReportBox.vue";
import { ref } from "vue";

const emit = defineEmits<{
  (e: "setupNav"): void;
}>();

function onCloseButton(): void {
  placeService.clearSelection();
}

const showReportBox = ref(false);

function toggleReportBox(): void {
  showReportBox.value = !showReportBox.value;
}

function navigate() {
  // console.log(store.selectedPlace);
  store.routeEnd = {
    name: store.selectedPlace!.name,
    location: [store.selectedPlace!.latitude, store.selectedPlace!.longitude],
  };
  emit("setupNav");
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

const priceSuffix: { [key: string]: string } = {
  ONCE: "",
  PER_HOUR: "/h",
  MONTHLY: "/miesiąc",
};
</script>

<template>
  <div id="placeInfo" class="container flex-col">
    <a class="close-button" @click="onCloseButton()">
      <i class="fa-solid fa-x" />
    </a>
    <h1>{{ store.selectedPlace!.name }}</h1>
    <div class="place-options flex-row">
      <button @click="navigate()" class="icon-button">
        <i class="fa-solid fa-route" />Nawiguj
      </button>
      <button @click="toggleReportBox()" class="icon-button">
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
      <template
        v-for="openHours, day in store.selectedPlace!.openHours"
        :key="day"
      >
        <div class="flex-row space-between" v-if="openHours">
          <div>{{ dayNames[day] }}</div>
          <div class="time">
            {{ openHours.from.substring(0, 5) }} -
            {{ openHours.to.substring(0, 5) }}
          </div>
        </div>
      </template>
    </div>
    <div class="info-item">
      <h5 class="info-label">Usługi</h5>
      <div
        class="flex-row space-between"
        v-for="service in store.selectedPlace!.services"
        :key="service.name"
      >
        <div>{{ service.name }}</div>
        <div class="price">
          {{ service.price }} zł{{ priceSuffix[service.priceType] }}
        </div>
      </div>
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
  position: fixed;
  width: 500px;
  left: 50px;
  top: 150px;
  z-index: 1000;
  letter-spacing: 0.05em;
}

h1 {
  font-size: 28px;
  margin-bottom: 10px;
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
  border-bottom: 1px solid rgba(128, 128, 128, 0.5);
  margin: 15px 0;
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

.price,
.time {
  width: 170px;
}
</style>
