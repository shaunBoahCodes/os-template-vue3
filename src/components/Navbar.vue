<script setup>
import { onMounted, ref } from "vue"
import { useWindowStore } from '@/stores/windowStore'
const store = useWindowStore()

const time = ref('16:20')

//const activeWindows = store.windows

function openWindow(windowId) {
  const payload = {
    'windowState': 'open',
    'windowId': windowId
  }
  store.setWindowState(payload)
}
</script>

<template>
  <nav class="w-full h-[35px] bg-gray-192 border-t-2 border-gray-250 z-50 flex items-center">
    <div 
        v-for="window in store.windows" 
        :key="window.key"
    >
        <button 
            v-if="activeWindow!==window.windowId && (window.windowState=='open' || window.windowState=='minimize')" @click="openWindow(window.windowId)" 
            class="w-[100px] h-[23px] bg-gray-192 border-[1.5px] rounded-[0.5px] border-[#FAFAFA_#5A5A5A_#5A5A5A_#FAFAFA] active:border-[black_#FAFAFA_#FAFAFA_black] shadow-[1.5px_1.5px_black] active:shadow-none  flex justify-start items-center mx-[2px] px-[5px] font-bold text-[0.7rem]">
                {{window.displayName}}
        </button>
        <button 
            v-else 
            @click="openWindow(window.windowId)" 
            class="w-[100px] h-[23px] cursor-default conic-gradient border-[1.5px] rounded-[0.5px] border-[black_#FAFAFA_#FAFAFA_black] flex justify-start items-center mx-[2px] px-[5px] font-bold text-[0.7rem]">
                {{window.displayName}}
        </button>
    </div>
    <div class="flex-grow"></div>
    <div alt="time" class="w-[75px] m-[5px] h-[25px] bg-gray-192 border-[1.5px] border-[#5A5A5A_#FAFAFA_#FAFAFA_#5A5A5A] flex justify-center items-center text-[0.6rem]">
        <!-- <img src="../assets/speakers.png" class="icon-image"/> -->
        <span>
            {{time}}
        </span>
    </div>
  </nav>
</template>