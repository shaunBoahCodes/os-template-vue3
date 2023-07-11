<script setup>
import { ref } from 'vue'
import { useWindowStore } from '@/stores/windowStore'
const store = useWindowStore()

const windows = store.getWindows

const gridHeight = ''

function openWindow(windowId) {
  const payload = {
      'windowState': 'open',
      'windowID': windowId
  }
  store.setWindowState(payload)
}
</script>

<template>
  <nav 
    class="grid-container"
    :style="{height: gridHeight}"
  >
      <li v-for="window in windows" :key="window.key">
          <button class="icon" @touchstart="openWindow(window.windowId)" @dblclick="openWindow(window.windowId)">
              <img class="icon-image" :src="require('../assets/icons/' + window.iconImage)" :alt="window.altText" />
              <div class="border">
              <p class="icon-text">
                  {{window.displayName}}
              </p>
              </div>
          </button>
      </li>
  </nav>
</template>