<script lang="ts">
export default defineComponent({
  name: 'HomePage',
})
</script>

<script setup lang="ts">
const items: string[] = ['category', 'campsite', 'bicycle', 'bus', 'cloudy', 'cube', 'departure']

const collapseSize = ref(400)

const collapseSizeWidth = computed(() => `${collapseSize.value}px`)
</script>

<template>
  <div class="box">
    <OverflowList :items="items" />
  </div>
  <div class="box" mt-6>
    <input v-model="collapseSize" w-full type="range" :min="0" :max="400">
    <div text-center>
      {{ collapseSize }}
    </div>
  </div>
  <div class="box collapse-wrapper mt-5">
    <CollapseList :items="items" />
  </div>
</template>

<style>
.box {
  width: 400px;
  background-color: rgb(237, 237, 237);
  margin: 30px;
  padding: 20px;
}

.collapse-wrapper {
  width: v-bind('collapseSizeWidth');
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>
