chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "changeIcon" && message.path) {
    // Change the extension icon
    chrome.action.setIcon({
      path: message.path,
    });
  }
});
