<script setup lang="ts"></script>

<template>
  <div id="advancedSearch">
    <form @submit.prevent>
      <h4>Szukaj obiekty o wybranym typie na zadanym obszarze</h4>
      <div class="input-group">
        <font-awesome-icon icon="fa-solid fa-map-location" />
        <input type="text" placeholder="Adres początkowy" />
      </div>
      <div class="input-group">
        <font-awesome-icon icon="fa-solid fa-wrench" />
        <input type="text" placeholder="Typ obiektu" />
      </div>
      <div class="input-group">
        <font-awesome-icon icon="fa-solid fa-ruler" />
        <input type="text" placeholder="Zasięg (km)" />
      </div>
    </form>
  </div>
</template>

<style scoped>
#advancedSearch {
  position: fixed;
  width: 350px;
  height: calc(100vh - 200px);
  left: 50px;
  top: 150px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: var(--default-shadow);
  z-index: 1000;
  padding: 20px;
}

h4 {
  text-align: center;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid #c2c2c2;
}

.input-group {
  display: flex;
  flex-direction: row;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  align-items: center;
}

input {
  margin-left: 20px;
  flex-grow: 1;
  background-color: #f8f8f8;
  border: none;
  border-radius: 5px;
  box-shadow: var(--small-shadow);
  padding: 0.5rem 0.5rem;
}
</style>
