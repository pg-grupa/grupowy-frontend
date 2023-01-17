<script setup lang="ts">
import type { Place } from "@/models/Place";
import { ref } from "vue";

defineProps<{ place: Place }>();
const emit = defineEmits<{ (e: "close"): void }>();
const msg = ref("");
function onSubmit() {
  console.log(msg.value);
  emit("close");
}
</script>

<template>
  <div id="curtain"></div>
  <div id="reportBox">
    <a class="close-button" @click="emit('close')">
      <i class="fa-solid fa-x" />
    </a>
    <h3>
      Zgłoś uwagę do obiektu: <br />
      {{ place.name }}
    </h3>
    <hr />
    <form @submit.prevent="onSubmit()">
      <textarea v-model="msg" placeholder="Treść uwagi" />
      <button><i class="fa-solid fa-triangle-exclamation" />Zgłoś</button>
    </form>
  </div>
</template>

<style scoped>
#curtain {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(70, 70, 70, 0.4);
  z-index: 2000;
}

#reportBox {
  display: flex;
  flex-direction: column;
  --width: 330px;
  --height: 330px;
  position: fixed;
  top: calc(50vh - (var(--height) / 2));
  left: calc(50vw - (var(--width) / 2));
  width: var(--width);
  height: var(--height);
  border-radius: 15px;
  box-shadow: var(--default-shadow);
  z-index: 2001;
  background-color: #ffffff;
  padding: 10px 20px;
}

.close-button {
  position: absolute;
  right: 15px;
  top: 10px;
  font-size: 1.3rem;
  z-index: 2002;
}

h3 {
  width: 100%;
  text-align: center;
}

hr {
  width: 100%;
  margin: 5px 0 10px;
  border: none;
  border-bottom: 1px solid gray;
}
form {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: end;
}

textarea {
  width: 100%;
  flex-grow: 1;
  margin-bottom: 5px;
  background-color: #f8f8f8;
  border: none;
  border-radius: 5px;
  box-shadow: var(--small-shadow);
  padding: 0.5rem 0.5rem;
}
</style>
