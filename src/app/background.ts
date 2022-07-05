// This script does not communicate with the DOM
console.log('Running background script (see chrome extensions page)');

// Globals
let activeTabId: number;
let recordedTabId: number;

// Define the types in our elementState map obj
interface ElementState {
  class?: string,
  textContent?: string,
  value?: string
}

// Initialize a Map obj
const elementStates = new Map<HTMLElement, ElementState>();

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background got a message!', message);

  switch (message.type) {
    case 'begin-recording':
      beginRecording();
      break;
    case 'event-triggered':
      // Track the event that happened
      // storeEvent(message.payload);
      // Diff the state of all tracked elements
      diffElementStates();
      // TODO: Notify the popup of the event and any differences in element states
      // sendElementStates();
      break;
    case 'pause-recording':
      break;
    case 'stop-recording':
      break;
  }
  // sendResponse({});
});

// TODO: Create data structure to track events and element changes
/*
{
  type: "input",
  event: "click",
  selector: ".fetchButton",
  timestamp: 1907489238
},
{
  type: "input",
  event: "keydown",
  keyValue: "m"
},
{
 type: "mutation",
 selector: "div.someCounter",
 newValue: 10
}
*/

/* interface UserInputEvent {
  event: string,
  timestamp: number,
  key?: string,
}

interface MutationEvent {

}

interface RecordingEvent {
  type: 'input' | 'mutation',
  selector: string,

}

const events: RecordingEvent[] = []; */

function diffElementStates() {
  // Use array destructuring to check every el/state pair (treated like subarrays) in the map and find the differences between prev and curr state
    // the stored state in the map at this point is now the previous state
  for (const [el, prevState] of elementStates) {
    const curState = getCurrState(el);
    console.log(diffState(prevState, curState));
    // TODO: Store element changes
    // TODO: Show whether stuff was added or removed?
    elementStates.set(el, curState);
  }
}

/* function storeEvent() {
  // TODO:
} */


// DEBUG
// const el = document.querySelector('article');

// Add key/val pair to the Map obj where the key is the el and the value is the element's state
// elementStates.set(el, getCurrState(el));


// Declare a function that takes in an HTMLElement and outputs an obj representing the element state
function getCurrState (el: HTMLElement | HTMLInputElement): ElementState {
  return {
    class: el.classList.value,
    textContent: el.innerText,
    value: 'value' in el ? el.value : undefined
  };
}

// TODO: refactor to allow for mutilpe elements in a single state array
function diffState(prev: ElementState, curr: ElementState): ElementState | null {
  let differences: ElementState = null;
  for (const _key in prev) {
    const key = _key as keyof ElementState;
    if (prev[key] !== curr[key]) {
      if (!differences) differences = {};
      differences[key] = curr[key];
    }
  }
  return differences;
}

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