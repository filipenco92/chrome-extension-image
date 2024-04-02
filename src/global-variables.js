export const INIT_EXTENSION = true; // when the extension is installed it will use this value in order to display the extension
export const MOUNT_DOM_EXTENSION_ID = "yosemite-extension";
export const POPUP_ID = "yosemite-image-tooltip";
export const MIN_IMG_WIDTH_PAGE = 100; // image widht on the page (the real image widht might be different)
export const MIN_IMG_HEIGHT_PAGE = 100; // image height on the page (the real image height might be different)
export const MIN_NATURAL_IMG_WIDTH = 100; // the real image widht (might be bigger or smaller than displayed on the page)
export const MIN_NATURAL_IMG_HEIGHT = 100; // the real image height (might be bigger or smaller than displayed on the page)
export const EXTENSION_IS_ENABLED = "extensionIsEnabled"; // the value of this variable will stored in chrome.storage.local and will be used in multiple components
export const ENABLED_ICONS = {
  "16": "assets/icon16.png",
  "48": "assets/icon48.png",
  "128": "assets/icon128.png",
};
export const DISABLED_ICONS = {
  "16": "assets/icon16_disabled.png",
  "48": "assets/icon48_disabled.png",
  "128": "assets/icon128_disabled.png",
};
