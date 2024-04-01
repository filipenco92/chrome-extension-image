let isExtensionEnabled = true;


chrome.action.onClicked.addListener((tab) => {
  isExtensionEnabled = !isExtensionEnabled;

  if (isExtensionEnabled) {
    console.log("Extension enabled.");
    chrome.action.setIcon({ path: {
      "16": "assets/icon16.png",
      "48": "assets/icon48.png",
      "128": "assets/icon128.png"
    }});
  } else {
    console.log("Extension disabled.");
    chrome.action.setIcon({ path: {
      "16": "assets/icon16_disabled.png",
      "48": "assets/icon48_disabled.png",
      "128": "assets/icon128_disabled.png"
    }});
  }

  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {data: isExtensionEnabled});
  });
});
