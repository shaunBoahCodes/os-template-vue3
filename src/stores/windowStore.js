import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useWindowStore = defineStore('useWindowStore', () => {

  const windows = ref([
    {
      windowId: "Windows", 
      windowState: "active",
      displayName: "Windows",
      windowComponent: 'OSWindow',
      windowContent: 'Windows',
      windowContentPadding: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      },
      position: "absolute",
      positionX: "1vw",
      positionY: "1vh",
      iconImage: "placeholder.png",
      altText: "Placeholder Icon",
      fullscreen: false
    },
    {
      windowId: "Mac", 
      windowState: "open",
      displayName: "Mac",
      windowComponent: 'OSMac',
      windowContent: 'Mac',
      windowContentPadding: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      },
      position: "absolute",
      positionX: "1vw",
      positionY: "1vh",
      iconImage: "placeholder.png",
      altText: "Placeholder Icon",
      fullscreen: false
    },
  ])

  /*-------------------------------------------*\
    Set active window
  \*-------------------------------------------*/
  const activeWindow = ref('nil')

  function setActiveWindow(window) {
    activeWindow.value = window
  }



  /*-------------------------------------------*\
    Push and pop active window from active windows array
  \*-------------------------------------------*/
  const activeWindows = ref([])

  function pushActiveWindow(window) {
    activeWindows.push(window)
  }

  function popActiveWindow(window) {
    const windowIndex = activeWindows.indexOf(window)
    if (windowIndex !== -1) {
      activeWindows.splice(windowIndex, 1)
    }
  }



  /*-------------------------------------------*\
    z-index increment function
  \*-------------------------------------------*/
  const zIndex = ref(2)

  function zIndexIncrement(windowID) {
    zIndex.value += 1
    //document.getElementById(windowID).style.zIndex = zIndex NEEDS FIXING
  }



  /*-------------------------------------------*\
    Set height of max-height of fullscreen window
  \*-------------------------------------------*/
  const fullscreenWindowHeight = ref(window.innerHeight + 'px')

  function setFullscreenWindowHeight(height) {
    fullscreenWindowHeight = height
  }

  function setFullscreen(payload) {
    
    const window = windows.find((window) => window.windowID === payload.windowID)

    window.fullscreen = payload.fullscreen;
  }



  /*-------------------------------------------*\
    Window state mutator
  \*-------------------------------------------*/
  async function setWindowState(payload) {
    // payload = {'windowState': 'open', 'windowID': 'WindowOne'}

    const window = windows.value.find((window) => window.windowId === payload.windowId)

    var preventAppendingOpenWindow = false;
    if (window.windowState == "open" || window.windowState == "minimize") {
      preventAppendingOpenWindow = true;
    }

    if (payload.windowState == "open") {
      window.windowState = payload.windowState
      delay(0)
      zIndexIncrement(payload.windowID)
      delay(0)
      setActiveWindow(payload.windowID)
      if (preventAppendingOpenWindow == false) {
        delay(0)
        pushActiveWindow(window)
      }

    } else if (payload.windowState == "close") {
      window.windowState = payload.windowState
      delay(0)
      popActiveWindow(window)
      delay(0)
      setActiveWindow('nil')

    } else if (payload.windowState == "minimize") {
      window.windowState = payload.windowState
      setActiveWindow('nil')

    } else {
      console.log("Error: windowState not found or invalid")
    }
  }



  function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }



  /*-------------------------------------------*\
    getters
  \*-------------------------------------------*/
  const getWindows = computed(() => windows)

  const getActiveWindow = computed(() => activeWindow)

  const getActiveWindows = computed(() => activeWindows)

  const getWindowById = computed((id) => windows.find((window) => window.windowId === id))

  const getWindowFullscreen = computed((id) => windows.find((window) => window.windowId === id).fullscreen)

  const getFullscreenWindowHeight = computed(() => fullscreenWindowHeight)

  return { windows, activeWindow, setActiveWindow, activeWindows, pushActiveWindow, popActiveWindow, zIndex, zIndexIncrement, fullscreenWindowHeight, setFullscreen, setFullscreen, setWindowState, delay,
  getActiveWindow, getWindowById, getWindowFullscreen, getWindows, getActiveWindows, getFullscreenWindowHeight }
})
