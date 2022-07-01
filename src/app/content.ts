import * as listeners from './modules/eventListeners';
// import mutationObserver from './modules/mutationObserver';

// This script has access to the DOM
console.log('Running content script (see chrome devtools)');

// Came with the template, idk what it does
// Runs on page load
chrome.runtime.sendMessage({}, (response) => {
  const checkReady = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(checkReady);
      console.log('We\'re in the injected content script!');
    }
  });
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'message':
      console.log('Content got a message! :', message.payload);
      break;
  }
  // sendResponse({});
});

// DEBUG
listeners.startEventListeners();