import { createApp, DefineComponent } from "vue";
import Popup from "./Popup.vue";

const MOUNT_EL_ID = "yosemite-extension";
export const POPUP_ID = 'yosemite-popup';
let mountEl = undefined;
let vm = undefined;

mountEl = document.createElement("div");
mountEl.setAttribute("id", MOUNT_EL_ID);

document.body.appendChild(mountEl);
vm = createApp(Popup).mount(mountEl);


const mouseOverImage = (event) => {
    // setTimeout(() => {
        let el = event.target
        let computedStyle = window.getComputedStyle(el)
        const isImg = el.nodeName === 'IMG'
        const isBgImg = computedStyle && computedStyle.backgroundImage && computedStyle.backgroundImage.includes('url')
        const extension = document.getElementById(MOUNT_EL_ID)
        const excludeExtensionImage = !(extension && extension.contains(el))
    
        if ((isImg || isBgImg) && excludeExtensionImage) {
            // if (!mountEl) {
            //     mountEl = document.createElement("div");
            //     mountEl.setAttribute("id", MOUNT_EL_ID);
        
            //     document.body.appendChild(mountEl);
            //     vm = createApp(Popup).mount(mountEl);
            // }
    
            let src;
            const rect = el.getBoundingClientRect();
            const top = (window.scrollY > rect.top + window.pageYOffset ? window.scrollY : rect.top + window.pageYOffset) + 5 + 'px'
            const left = rect.left + window.pageXOffset + 5 + 'px';
            
            if (isImg) {
                src = el.src
              } else if (isBgImg) {
                src = computedStyle.backgroundImage.slice(5, -2)
              }
            //   if (!vm.popup) {
                  vm.popupTop = top
                  vm.popupLeft = left
                  vm.imageSrc = src
                  vm.popup = true
            //   }
    
        } else {
            const app = document.getElementById(MOUNT_EL_ID);
            if (app && vm && vm.popup && el.id !== POPUP_ID && !document.getElementById(POPUP_ID).contains(el)) {
                // app.remove()
                // mountEl = undefined;
                // vm = undefined;
                vm.popup = false
            }
        }
    // }, 500)
} 

document.addEventListener('mouseover', mouseOverImage)
