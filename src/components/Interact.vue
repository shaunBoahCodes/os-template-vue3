<template>
  <div 
    :id="props.componentName"
    class="absolute"
    :class="fullscreenTransition"
    :style="{ 
      'top': position.y + 'px', 
      'left': position.x + 'px',
      'width': dimensions.width,
      'height': dimensions.height,
    }"
  >
    
  </div>
</template>

<script setup>
import interact from 'interactjs'
import { reactive, onMounted, ref, watch, computed } from 'vue'
import { useWindowStore } from "@/stores/windowStore";
const store = useWindowStore();

const props = defineProps({ componentName: String, updateKey: Number })
const emit = defineEmits(['updatePosition', 'updateDimensions'])

//set data on mount
onMounted(() => {
  position.x = parseFloat(store.getWindowPosition(props.componentName).x)
  position.y = parseFloat(store.getWindowPosition(props.componentName).y)
  dimensions.width = parseFloat(store.getWindowDimensions(props.componentName).width) + 'px'
  dimensions.height = parseFloat(store.getWindowDimensions(props.componentName).height) + 'px'
})

/*----------------------------------------------//

Data, current and stored

//----------------------------------------------*/
const position = reactive({ x: 0, y: 0 })
const dimensions = reactive({ width: 0, height: 0 })

var storedPosition = { x: 0, y: 0 }
var storedDimensions = { width: 0, height: 0 }

const restoreData = () => {
  position.x = storedPosition.x
  position.y = storedPosition.y
  dimensions.width = storedDimensions.width
  dimensions.height = storedDimensions.height
}


/*----------------------------------------------//

Fullscreen css transition

//----------------------------------------------*/
const fullscreenTransition = ref('')
const setTransition = () => {
  if (store.getWindowFullscreen(props.componentName) === false) {
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
watch(
  () => props.updateKey,
  (value) => {
    setTransition()
    if (store.getWindowFullscreen(props.componentName) === true) {
    // UNFULLSCREEN
      restoreData()
      store.setFullscreen({
        windowID: props.componentName,
        fullscreen: false,
        position: { x: storedPosition.x, y: storedPosition.y },
        dimensions: { width: storedDimensions.x, height: storedDimensions.y }
      });
    } 
    // SET FULLSCREEN
    else if (store.getWindowFullscreen(props.componentName) === false) {
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
        windowID: props.componentName,
        fullscreen: true,
        position: { x: 0, y: 0 },
        dimensions: { width: '100%', height: '100%' }
      });
    }
  }
)

/*----------------------------------------------//

Interact

//----------------------------------------------*/
const restrictToParent = interact.modifiers.restrict({
  restriction: 'parent',
  elementRect: { left: 0, right: 1, top: 0, bottom: 0 },
})

const topBarId = 'top-bar' + props.componentName

interact(`#${props.componentName}`)
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
    allowFrom: `#${topBarId}`
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
    }
  })
</script>