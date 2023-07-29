<script setup>
import interact from 'interactjs'
import { reactive, onMounted, ref, watch, computed } from 'vue'
import { useWindowStore } from "@/stores/windowStore";
const store = useWindowStore();

const props = defineProps({ nameOfWindow: String });

//set data on mount based on starting data
onMounted(() => {
  window.value = store.getWindowById(componentName.value)
  position.x = parseFloat(store.getWindowPosition(componentName.value).x)
  position.y = parseFloat(store.getWindowPosition(componentName.value).y)
  dimensions.width = parseFloat(store.getWindowDimensions(componentName.value).width) + 'px'
  dimensions.height = parseFloat(store.getWindowDimensions(componentName.value).height) + 'px'
})

/*----------------------------------------------//

Data, current and stored

//----------------------------------------------*/
const position = reactive({ x: 0, y: 0 })
const dimensions = reactive({ width: 0, height: 0 })

var storedPosition = { x: 0, y: 0 }
var storedDimensions = { width: 0, height: 0 }

const componentName = ref(props.nameOfWindow); // name of this window
const activeWindow = store.getActiveWindow;
const window = ref({});

const restoreData = () => {
  position.x = storedPosition.x
  position.y = storedPosition.y
  dimensions.width = storedDimensions.width
  dimensions.height = storedDimensions.height
}

//SVG data
const border = ref(4)
const svgDimensions = reactive({
  w: computed(() => parseFloat(dimensions.width)),
  h: computed(() => parseFloat(dimensions.height)),
  outer: reactive({
    x: 2,
    y: 2,
    w: computed(() => svgDimensions.w - 4),
    h: computed(() => svgDimensions.h - 4),
  }),
  inner: reactive({
    x: border.value,
    y: border.value,
    w: computed(() =>  svgDimensions.w - 2 * border.value),
    h: computed(() =>  svgDimensions.h - 2 * border.value),
  })
})

/*----------------------------------------------//

Fullscreen css transition

//----------------------------------------------*/
const fullscreenTransition = ref('')
const setTransition = () => {
  if (store.getWindowFullscreen(componentName.value) === false) {
    fullscreenTransition.value = 'transition-all ease-in-out duration-500'
  } else {
    new Promise((resolve) => {
      fullscreenTransition.value = 'transition-all ease-in-out duration-500'
      resolve()
    }).then(() => setTimeout(() => fullscreenTransition.value = '', 500))
  }
}

/*----------------------------------------------//

Toggle fullscreen

//----------------------------------------------*/
const toggleFullscreen = () => {
  setTransition()
  enableInteract.value = !enableInteract.value
  if (store.getWindowFullscreen(componentName.value) === true) {
  // UNFULLSCREEN
    restoreData()
    store.setFullscreen({
      windowID: componentName.value,
      fullscreen: false,
      position: { x: storedPosition.x, y: storedPosition.y },
      dimensions: { width: storedDimensions.x, height: storedDimensions.y }
    });
  } 
  // SET FULLSCREEN
  else if (store.getWindowFullscreen(componentName.value) === false) {
    //store current position and dimensions
    storedPosition.x = position.x
    storedPosition.y = position.y
    storedDimensions.width = dimensions.width
    storedDimensions.height = dimensions.height

    //set position to 0 and dimensions to full
    position.x = 0
    position.y = 0
    dimensions.width = '100%'
    dimensions.height = '100%'

    store.setFullscreen({
      windowID: componentName.value,
      fullscreen: true,
      position: { x: 0, y: 0 },
      dimensions: { width: '100%', height: '100%' }
    });
  }
}


const closeWindow = () => {
  new Promise((resolve) => {
    store.setWindowState({
      windowState: "close",
      windowID: componentName.value,
    })
    resolve()
  })
  .then(() => {
    if (store.getWindowFullscreen(componentName.value)) {
      // RESETS FULLSCREEN TO FALSE ON CLOSE
      restoreData()
      enableInteract.value = !enableInteract.value
      setTransition()

      store.setFullscreen({
        windowID: componentName.value,
        fullscreen: false,
        position: { x: storedPosition.x, y: storedPosition.y },
        dimensions: { width: storedDimensions.x, height: storedDimensions.y }
      });
    }
  })
};

const setActiveWindow = () => {
  store.zIndexIncrement(componentName.value);
  store.setActiveWindow(componentName.value);
};

/*----------------------------------------------//

Interact

//----------------------------------------------*/
const enableInteract = ref(true)

const restrictToParent = interact.modifiers.restrict({
  restriction: 'parent',
  elementRect: { left: 0, right: 1, top: 0, bottom: 0 },
})

const topBarId = 'top-bar' + componentName.value
const rectId = 'rect' + componentName.value

interact(`#${componentName.value}`)
  .draggable({
    listeners: {
      start (event) {
        console.log(event.type, event.target)
      },
      move (event) {
        position.x += event.dx
        position.y += event.dy
      },
    },
    modifiers: [restrictToParent],
    allowFrom: `#${topBarId}`,
    enabled: enableInteract.value
  })
  .resizable({
    edges: { top: true, left: true, bottom: true, right: true },
    listeners: {
      move: function (event) {
        position.x += parseFloat(event.deltaRect.left)
        position.y += parseFloat(event.deltaRect.top)

        dimensions.width = event.rect.width + 'px'
        dimensions.height = event.rect.height + 'px'
      }
    },
    allowFrom: `#${rectId}`,
    ignoreFrom: `#${topBarId}`,
    enabled: enableInteract.value
  })
</script>

<template>
  <div 
    :id="componentName"
    class="absolute"
    :class="fullscreenTransition"
    :style="{ 
      'top': position.y + 'px', 
      'left': position.x + 'px',
      'width': dimensions.width,
      'height': dimensions.height,
      'z-index' : window.zIndex,
    }"
  >
    <div
      :class="[
        window.windowState == 'minimize' && 'hidden',
        'box-border w-full h-full touch-none select-none flex-col',
        'border-b-[1.5px] border-l-2 border-r-[1.5px] border-t-2 border-[#FAFAFA_#5A5A5A_#5A5A5A_#FAFAFA] bg-gray-195 shadow-[1.5px_1.5px_black] outline-gray-222',
      ]"
      @click="setActiveWindow"
    >
      <svg xmlns="http://www.w3.org/2000/svg" :width="svgDimensions.w" :height="svgDimensions.h" class="absolute bottom-[0.1px] right-[0.1px] ">
        <rect :id="rectId" :x="svgDimensions.outer.x" :y="svgDimensions.outer.y" :width="svgDimensions.outer.w" :height="svgDimensions.outer.h" fill="none" stroke="transparent" :stroke-width="border" />
        <rect :x="svgDimensions.inner.x" :y="svgDimensions.inner.y" :width="svgDimensions.inner.w" :height="svgDimensions.inner.h" fill="none" stroke="none" />
      </svg>
      
      <!--TOP BAR-->
      <div
        :id="topBarId"
        :class="[activeWindow == window.windowId ? 'bg-[rgb(0,0,124)]' : 'bg-gray-90', 'm-0.5 absolute z-10 flex h-[25px] w-[calc(100%-8px)] flex-row items-center justify-between px-[3px] cursor-default']"
        @dblclick="toggleFullscreen"
        @click="console.log(1)"
      >
        <h3
          class="window-name ml-[3px] flex items-center p-0 font-bold text-white"
        >
          {{ window.displayName }}
        </h3>
        <div class="flex items-center justify-between">
          <button
            class="ml-0.5 flex h-4 w-4 items-center justify-center border border-[#FAFAFA_#5A5A5A_#5A5A5A_#FAFAFA] bg-gray-195 text-[20px] font-bold shadow-[1.5px_1.5px_black] active:border-[1.5px] active:border-[black_#FAFAFA_#FAFAFA_black] active:bg-gray-192 active:shadow-none"
            @click.stop="toggleFullscreen"
          >
            +
          </button>
          <button
            class="ml-0.5 flex h-4 w-4 items-center justify-center border border-[#FAFAFA_#5A5A5A_#5A5A5A_#FAFAFA] bg-gray-195 text-[20px] font-bold shadow-[1.5px_1.5px_black] active:border-[1.5px] active:border-[black_#FAFAFA_#FAFAFA_black] active:bg-gray-192 active:shadow-none"
            @click.stop="store.setWindowState({ windowState: 'minimize', windowID: componentName.value })"
          >
            -
          </button>
          <button
            class="ml-0.5 flex h-4 w-4 items-center justify-center border border-[#FAFAFA_#5A5A5A_#5A5A5A_#FAFAFA] bg-gray-195 text-[20px] font-bold shadow-[1.5px_1.5px_black] active:border-[1.5px] active:border-[black_#FAFAFA_#FAFAFA_black] active:bg-gray-192 active:shadow-none"
            @click.stop="closeWindow"
          >
            ×
          </button>
        </div>
      </div>

      <div class="p-2">
        <slot class="window-content" name="content"> </slot>
      </div>

    </div>
  </div>
</template>
