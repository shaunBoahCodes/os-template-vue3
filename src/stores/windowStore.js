import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useWindowStore = defineStore("useWindowStore", () => {
  const windows = ref([
    {
      windowId: "Windows",
      windowState: "close",
      displayName: "Windows",
      windowComponent: "OSWindow",
      windowContent: "Hello There this is a windows window",

      position: "absolute",
      positionX: "100px",
      positionY: "100px",
      width: '500px',
      height: '500px',
      zIndex: 2,

      iconImage: "placeholder.png",
      altText: "Placeholder Icon",
      fullscreen: false,
    },
    {
      windowId: "Mac",
      windowState: "close",
      displayName: "Mac",
      windowComponent: "OSMac",
      windowContent: "Mac",

      position: "absolute",
      positionX: "100px",
      positionY: "100px",
      width: '500px',
      height: '500px',
      zIndex: 2,

      iconImage: "placeholder.png",
      altText: "Placeholder Icon",
      fullscreen: false,
    },
  ]);

  /*-------------------------------------------*\
    Set active window
  \*-------------------------------------------*/
  const activeWindow = ref("nil");

  function setActiveWindow(window) {
    activeWindow.value = window;
  }

  /*-------------------------------------------*\
    Push and pop active window from active windows array
  \*-------------------------------------------*/
  const activeWindows = ref([]);

  function pushActiveWindow(window) {
    activeWindows.value.push(window);
  }

  function popActiveWindow(window) {
    const windowIndex = activeWindows.value.indexOf(window);
    if (windowIndex !== -1) {
      activeWindows.value.splice(windowIndex, 1);
    }
  }

  /*-------------------------------------------*\
    z-index increment function
  \*-------------------------------------------*/
  const zIndex = ref(2);

  function zIndexIncrement(windowID) {
    zIndex.value += 1;

    const window = windows.value.find((window) => window.windowId === windowID);
    window.zIndex = zIndex.value
  }

  /*-------------------------------------------*\
    Set position
  \*-------------------------------------------*/

  const setWindowPosition = (id, payload) => {
      windows.value.find((window) => window.windowId === id).positionX = payload.x
      windows.value.find((window) => window.windowId === id).positionY = payload.y
  }

  /*-------------------------------------------*\
    Set fullscreen
  \*-------------------------------------------*/

  function setFullscreen(payload) {
    const window = windows.value.find(
      (window) => window.windowId === payload.windowID,
    );
    //set position
    //setWindowPosition(payload.windowID, payload.position)
    //window.width = payload.dimensions.width
    //window.height = payload.dimensions.height
    window.fullscreen = payload.fullscreen;
  }

  /*-------------------------------------------*\
    Window state mutator
  \*-------------------------------------------*/
  const setWindowStatePromise = (window, payload) =>
    new Promise((resolve) => {
      window.windowState = payload.windowState;
      resolve();
    });



  async function setWindowState(payload) {
    // payload = {'windowState': 'open', 'windowID': 'WindowOne'}

    const window = windows.value.find(
      (window) => window.windowId === payload.windowID,
    );

    var preventAppendingOpenWindow = false;

    if (window.windowState == "open" || window.windowState == "minimize") {
      preventAppendingOpenWindow = true;
    }

    if (payload.windowState == "open") {
      setWindowStatePromise(window, payload)
        .then(() => {
          zIndexIncrement(payload.windowID);
        })
        .then(() => {
          setActiveWindow(payload.windowID);
        });
      if (preventAppendingOpenWindow == false) {
        pushActiveWindow(window);
      }
    } else if (payload.windowState == "close") {
      setWindowStatePromise(window, payload)
        .then(() => {
          popActiveWindow(window);
        })
        .then(() => {
          setActiveWindow("nil");
        });
    } else if (payload.windowState == "minimize") {
      setWindowStatePromise(window, payload).then(() => {
        setActiveWindow("nil");
      });
    } else {
      console.log("Error: windowState not found or invalid");
    }
  }

  /*-------------------------------------------*\
    getters
  \*-------------------------------------------*/
  const getWindows = computed(() => windows);

  const getActiveWindow = computed(() => activeWindow);

  const getActiveWindows = computed(() => activeWindows);

  const getWindowById = (id) => windows.value.find((window) => window.windowId === id)

  const getWindowDimensions = (id) => {
    return {
      width: windows.value.find((window) => window.windowId === id).width, 
      height: windows.value.find((window) => window.windowId === id).height
    }
  }

  const getWindowPosition = (id) => {
    return {
      x: windows.value.find((window) => window.windowId === id).positionX, 
      y: windows.value.find((window) => window.windowId === id).positionY
    }
  }

  const getWindowFullscreen = (id) => windows.value.find((window) => window.windowId === id).fullscreen

  return {
    windows,
    activeWindow,
    setActiveWindow,
    activeWindows,
    pushActiveWindow,
    popActiveWindow,
    zIndex,
    zIndexIncrement,
    setFullscreen,
    setFullscreen,
    setWindowState,
    getActiveWindow,
    getWindowById,
    getWindowPosition,
    setWindowPosition,
    getWindowDimensions,
    getWindowFullscreen,
    getWindows,
    getActiveWindows,
  };
});
