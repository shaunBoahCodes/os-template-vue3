<script setup>
import { computed, onMounted, ref } from "vue";
import { useWindowStore } from "@/stores/windowStore";
const store = useWindowStore();

const activeWindow = store.getActiveWindow;

function openWindow(windowId) {
  const payload = {
    windowState: "open",
    windowID: windowId,
  };
  store.setWindowState(payload);
}

const time = ref('')

function date() {
  const date = new Date()
  let hours = date.getHours()
  let mins = date.getMinutes()
  const amPm = hours >= 12 ? 'PM' : 'AM';

  hours = String(hours).padStart(2, '0')
  mins = String(mins).padStart(2, '0')
  time.value = `${hours}:${mins} ${amPm}`
}

onMounted(() => {
  setInterval(() => date(), 1000);
})
</script>

<template>
  <nav
    class="z-50 flex h-[35px] w-full items-center border-t-2 border-gray-250 bg-gray-192"
  >
    <div v-for="window in store.activeWindows" :key="window.key">
      <button
        v-if="activeWindow == window.windowId"
        @click="openWindow(window.windowId)"
        class="conic-gradient mx-[2px] flex h-[23px] w-[100px] cursor-default items-center justify-start rounded-[0.5px] border-[1.5px] border-[black_#FAFAFA_#FAFAFA_black] px-[5px] text-[0.7rem] font-bold"
      >
        {{ window.displayName }}
      </button>
      <button
        v-else
        @click="openWindow(window.windowId)"
        class="mx-[2px] flex h-[23px] w-[100px] items-center justify-start rounded-[0.5px] border-[1.5px] border-[#FAFAFA_#5A5A5A_#5A5A5A_#FAFAFA] bg-gray-192 px-[5px] text-[0.7rem] font-bold shadow-[1.5px_1.5px_black] active:border-[black_#FAFAFA_#FAFAFA_black] active:shadow-none"
      >
        {{ window.displayName }}
      </button>
    </div>
    <div class="flex-grow"></div>
    <div
      alt="time"
      class="m-[5px] flex h-[25px] w-[75px] items-center justify-center border-[1.5px] border-[#5A5A5A_#FAFAFA_#FAFAFA_#5A5A5A] bg-gray-192 text-[0.6rem]"
    >
      <!-- <img src="../assets/speakers.png" class="icon-image"/> -->
      <span>
        {{ time }}
      </span>
    </div>
  </nav>
</template>
