import * as listeners from './modules/eventListeners';
// import observer, {targetNode, config} from './modules/mutationObserver';
import { enableHighlight, disableHighlight } from './modules/elementPicker';

// This script has access to the DOM
console.log('Running content script (see chrome devtools)');

interface ElementState {
  class?: string,
  textContent?: string,
  value?: string
}

// Came with the template, idk what it does
// Runs on page load
/* chrome.runtime.sendMessage({}, (response) => {
  const checkReady = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(checkReady);
      console.log('We\'re in the injected content script!');
    }
  });
}); */

// Listen for messages from background script
// DEBUG

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'add-listeners':
      listeners.startEventListeners(message.payload.recordingState);
      enableHighlight();
      // observer.observe(targetNode, config);
      break;
    case 'get-element-states':
      // message: { type: 'get-element-states', payload: ['.class > div', 'button > #smthng'] }
      // iterate over all selectures in payload 
      const elementStates: { [key: string]: ElementState } = {};
      for (const selector of message.payload) {
        const el = document.querySelector(selector);
        elementStates[selector] = getCurrState(el);
      }

      // Take in some array of CSS selectors
      // Look up those elements in the DOM and get their state
      // Send those states back to the background
      sendResponse(elementStates);
      

    // TODO: Set up a message listener for the background to ask for the state of elements on the page
    // based on their CSS selector
  }
  // sendResponse({});
});


// Method to get the current state of an element based on its selector
// Declare a function that takes in an HTMLElement and outputs an obj representing the element state
function getCurrState (el: HTMLElement | HTMLInputElement): ElementState {
  return {
    class: el.classList?.value,
    textContent: el.innerText,
    value: 'value' in el ? el.value : undefined
  };
}

