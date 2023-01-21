<script setup lang="ts">
const props = defineProps({
  faClass: { type: String, required: true },
  bgColor: { type: String, default: "CornflowerBlue" },
  textColor: { type: String, default: "white" },
});
</script>
<template>
  <div class="pin-container">
    <div class="big" :style="{ color: bgColor }">
      <i class="fa-solid fa-location-pin"></i>
    </div>
    <div class="small" :style="{ color: textColor }">
      <i class="fa-solid" :class="faClass"></i>
    </div>
  </div>
</template>

<style scoped>
.pin-container {
  height: 70px;
  width: 50px;
  min-width: 50px;
  margin-right: 15px;
}
.big {
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  font-size: 50px;
  line-height: 50px;
  height: 60px;
  width: 50px;
  text-align: center;
  z-index: 1;
}

.small {
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  font-size: 18px;
  line-height: 40px;
  width: 50px;
  text-align: center;
  z-index: 2;
}
</style>
