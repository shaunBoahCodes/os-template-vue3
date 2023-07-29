<script setup>
import { ref } from "vue";
import { useWindowStore } from "@/stores/windowStore";
const store = useWindowStore();

const windows = store.getWindows;

function openWindow(windowId) {
  const payload = {
    windowState: "open",
    windowID: windowId,
  };
  store.setWindowState(payload);
}
</script>

<template>
  <nav class="grid-container pt-[10px] w-0 flex flex-col flex-wrap">
    <li v-for="window in windows" :key="window.key" class="m-0 list-none p-0">
      <button
        class="group m-4 flex w-[calc(100%-32px)] flex-col items-center text-center text-black"
        @touchstart="openWindow(window.windowId)"
        @dblclick="openWindow(window.windowId)"
      >
        <img
          class="group-focus:filter-icon mb-[5px] h-[30px] w-[30px]"
          src="https://placehold.co/400x400"
          :alt="window.altText"
        />
        <div
          class="group-focus:border group-focus:border-dotted group-focus:border-[rgb(255,255,148)]"
        >
          <p
            class="m-[1px] p-0 text-[12px] leading-[13.8px] text-white group-focus:m-0 group-focus:bg-[rgb(0,0,118)]"
          >
            {{ window.displayName }}
          </p>
        </div>
      </button>
    </li>
  </nav>
</template>
