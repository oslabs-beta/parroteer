// This script does not communicate with the DOM
console.log('Running background script (see chrome extensions page)');

// Globals
let activeTabId: number;
let recordedTabId: number;

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background got a message!', message);

  switch (message.type) {
    case 'begin-recording':
      beginRecording();
      break;
  }
  // sendResponse({});
});

/**
 * Message the content script and instruct it to add event listeners and observer
 */
function beginRecording() {
  recordedTabId = activeTabId;
  chrome.tabs.sendMessage(recordedTabId, { type: 'message', payload: 'hello' });
}

/// Tab event listeners
// On change tabs: Set active tab id to current tab id
chrome.tabs.onActivated.addListener((activeInfo) => {
  activeTabId = activeInfo.tabId;
});