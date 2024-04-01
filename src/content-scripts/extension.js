import { createApp, DefineComponent } from "vue";
import Extension from "./Extension.vue";

const MOUNT_EXTENSION_ID = "yosemite-extension";
export const POPUP_ID = 'yosemite-image-tooltip';
const MIN_IMG_WIDTH = 100;
const MIN_IMG_HEIGHT = 100;
let mountEl = undefined;
let vm = undefined;

const mouseOverImage = (event) => {
    let el = event.target
    let computedStyle = window.getComputedStyle(el)
    const isImg = el.nodeName === 'IMG'
    const isBgImg = computedStyle && computedStyle.backgroundImage && computedStyle.backgroundImage.includes('url')
    const imageTooltip = document.getElementById(POPUP_ID)

    if ((isImg || isBgImg) && !(imageTooltip && imageTooltip.contains(el))) {
        if (!mountEl) {
            mountEl = document.createElement("div");
            mountEl.setAttribute("id", MOUNT_EXTENSION_ID);
    
            document.body.appendChild(mountEl);
            vm = createApp(Extension).mount(mountEl);
        }

        let src;
        const rect = el.getBoundingClientRect();
        
        // if image is on viewport completeley then show the tooltip on top left corner, if not then on bottom left corner 
        const top = (window.scrollY > rect.top + window.scrollY ? rect.bottom + window.scrollY - 40 : rect.top + window.scrollY) + 5 + 'px'
        const left = rect.left + window.scrollX + 5 + 'px';
        if (rect && rect.width >= MIN_IMG_WIDTH && rect.height >= MIN_IMG_HEIGHT) {
            // show the imageTooltip if only image width is >= MIN_IMG_WIDTH && height >= MIN_IMG_HEIGHT
            if (isImg) {
                src = el.src
            } else if (isBgImg) {
                src = computedStyle.backgroundImage.slice(5, -2)
            }

            if (rect.height + rect.top >= MIN_IMG_HEIGHT / 3 && window.innerHeight - rect.top >= MIN_IMG_HEIGHT / 3)  {
                // if at least 33% from the minium image height is visible in viewport
                vm.popupTop = top
                vm.popupLeft = left
                vm.imageSrc = src
                vm.imageTooltip = true
            }

        }

    } else {
        const app = document.getElementById(MOUNT_EXTENSION_ID);
        if (app && el.id !== POPUP_ID && !(imageTooltip && imageTooltip.contains(el))) {
            vm.imageTooltip = false
        }
    }
} 

const removeDOMExtension = () => {
    if (vm) {
        const app = document.getElementById(MOUNT_EXTENSION_ID)
        if (app && app.children && app.children.length === 0) {
            // remove extension from the DOM
            app.remove()
            mountEl = undefined;
            vm = undefined
        }
    }
}

document.addEventListener('mouseover', mouseOverImage)

document.addEventListener('mousemove', removeDOMExtension)

chrome.runtime.onMessage.addListener((message) => {
    if (message && message.data === false) {
        // extensionIsEnabled = message.data
        removeDOMExtension();
        document.removeEventListener('mouseover', mouseOverImage)
    } else {
        document.addEventListener('mouseover', mouseOverImage)
    }
  });