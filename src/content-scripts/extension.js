import { createApp } from "vue";
import Extension from "./Extension.vue";
import {
  INIT_EXTENSION,
  POPUP_ID,
  MOUNT_DOM_EXTENSION_ID,
  MIN_IMG_WIDTH_PAGE,
  MIN_IMG_HEIGHT_PAGE,
  EXTENSION_IS_ENABLED,
  ENABLED_ICONS,
  DISABLED_ICONS,
} from "@/global-variables";

let mountEl = undefined;
let vm = undefined;

const mouseOverImage = (event) => {
  let el = event.target;
  let computedStyle = window.getComputedStyle(el);
  const isImg = el.nodeName === "IMG";
  const isBgImg =
    computedStyle &&
    computedStyle.backgroundImage &&
    computedStyle.backgroundImage.includes("url");
  const imageTooltip = document.getElementById(POPUP_ID);

  if ((isImg || isBgImg) && !(imageTooltip && imageTooltip.contains(el))) {
    if (!mountEl) {
      mountEl = document.createElement("div");
      mountEl.setAttribute("id", MOUNT_DOM_EXTENSION_ID);

      document.body.appendChild(mountEl);
      vm = createApp(Extension).mount(mountEl);
    }

    let src;
    const rect = el.getBoundingClientRect();

    // if image is on viewport completeley then show the tooltip on top left corner, if not then on bottom left corner
    const top =
      (window.scrollY > rect.top + window.scrollY
        ? rect.bottom + window.scrollY - 40
        : rect.top + window.scrollY) +
      5 +
      "px";
    const left = rect.left + window.scrollX + 5 + "px";
    if (
      rect &&
      rect.width >= MIN_IMG_WIDTH_PAGE &&
      rect.height >= MIN_IMG_HEIGHT_PAGE
    ) {
      // show the imageTooltip if only image width is >= MIN_IMG_WIDTH_PAGE && height >= MIN_IMG_HEIGHT_PAGE
      if (isImg) {
        src = el.src;
      } else if (isBgImg) {
        src = computedStyle.backgroundImage.slice(5, -2);
      }

      if (
        rect.height + rect.top >= MIN_IMG_HEIGHT_PAGE / 3 &&
        window.innerHeight - rect.top >= MIN_IMG_HEIGHT_PAGE / 3
      ) {
        // if at least 33% from the minium image height is visible in viewport
        vm.popupTop = top;
        vm.popupLeft = left;
        vm.imageSrc = src;
        vm.imageTooltip = true;
      }
    }
  } else {
    const app = document.getElementById(MOUNT_DOM_EXTENSION_ID);
    if (
      app &&
      el.id !== POPUP_ID &&
      !(imageTooltip && imageTooltip.contains(el))
    ) {
      vm.imageTooltip = false;
    }
  }
};

const removeDOMExtension = () => {
  if (vm) {
    const app = document.getElementById(MOUNT_DOM_EXTENSION_ID);
    if (app && app.children && app.children.length === 0) {
      // remove extension from the DOM
      app.remove();
      mountEl = undefined;
      vm = undefined;
    }
  }
};

const changeIcon = (path) => {
  chrome.runtime.sendMessage({ action: "changeIcon", path: path });
};

const turnOnExtension = () => {
  // turn on the extension
  document.addEventListener("mouseover", mouseOverImage);
  document.addEventListener("mousemove", removeDOMExtension);
  // and change extension icons to enabled icons
  changeIcon(ENABLED_ICONS);
};

const turnOffExtension = () => {
  // turn off the extension
  document.removeEventListener("mouseover", mouseOverImage);
  document.removeEventListener("mousemove", removeDOMExtension);
  // and change extension icons to disabled icons
  changeIcon(DISABLED_ICONS);
};

chrome.storage.local.get([EXTENSION_IS_ENABLED], (result) => {
  console.log("get --->: ", result);

  if (result && result.hasOwnProperty(EXTENSION_IS_ENABLED)) {
    // if there is chrome.storage.local[EXTENSION_IS_ENABLED] true then turn on the extension
    if (result[EXTENSION_IS_ENABLED]) turnOnExtension();
    // if there is chrome.storage.local[EXTENSION_IS_ENABLED] false then turn off the extension
    else turnOffExtension();
  } else {
    // if there is no chrome.storage.local[EXTENSION_IS_ENABLED] then set it with the INIT_EXTENSION value,
    // this will trigger to listen for changes in extension state
    // and will call turnOnExtension() or turnOffExtension() depending by the INIT_EXTENSION
    chrome.storage.local.set({
      [EXTENSION_IS_ENABLED]: INIT_EXTENSION,
    });
  }
});

// Listen for changes in extension state
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && changes.hasOwnProperty([EXTENSION_IS_ENABLED])) {
    if (changes[EXTENSION_IS_ENABLED].newValue) turnOnExtension();
    else turnOffExtension();
  }
});
