<script setup>
import Navbar from "@/components/Navbar.vue";
import AppGrid from "@/components/AppGrid.vue";
import Window from "@/components/Window.vue";
import { useWindowStore } from "@/stores/windowStore";
import { onMounted, ref } from 'vue'
const store = useWindowStore();

const windows = store.getWindows;
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <div
      v-for="(window, index) in windows"
      :key="index"
      :aria-label="window.displayName"
    >
      <Window
        v-show="window.windowState === 'open'"
        :nameOfWindow="window.displayName"
      >
      </Window>
    </div>
    <AppGrid id="screen" class="h-full" />
    <Navbar />
  </div>
</template>
