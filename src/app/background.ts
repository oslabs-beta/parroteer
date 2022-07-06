// This script does not communicate with the DOM
console.log('Running background script (see chrome extensions page)');

/// Globals
let activeTabId: number;
let recordedTabId: number;
const events: (UserInputEvents | Mutation)[] = [];


// btn test blue
// class: 'btn test blue'
// click
// class: 'btn blue'
// button.not.hasClass('test')
// button.class.equals('btn blue')
interface Mutation extends ElementState, StoredEvent {}

interface StoredEvent {
  selector: string,
  timestamp?: number,
  type: string,
}

interface UserInputEvents extends StoredEvent {
  event: string
}

// Define the types in our elementState map obj
interface ElementState {
  class?: string,
  textContent?: string,
  value?: string
}
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

type CSSSelector = string;

// Initialize a Map obj
const elementStates = new Map<CSSSelector, ElementState>();

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background got a message!', message);

  switch (message.type) {
    case 'begin-recording':
      beginRecording();
      break;
    case 'event-triggered':
      // TODO: Check to make sure activeTabId is recordedTabId
      // Diff the state of all tracked elements
      diffElementStates();
      // Track the event that happened
      // storeEvent(message.payload);
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

function diffElementStates() {
  // Message content script to request the current state for all tracked elements
  chrome.tabs.sendMessage(activeTabId, {type: 'get-element-states', payload: Array.from(elementStates.keys())}, (currStates: { [key: string]: ElementState }) => {
    for (const selector in currStates) {
      const currState = currStates[selector];
      const prevState = elementStates.get(selector);

      // Store element changes
      const changedState = diffState(prevState, currState);
      console.log(changedState);
      events.push({
        type: 'mutation',
        ...changedState,
        selector
      });
      
      // TODO: Show whether stuff was added or removed?
      elementStates.set(selector, currState);
    }
  });
}


 

/* function storeEvent() {
  // TODO:
} */


// DEBUG
// const testSelector = 'HTML > BODY > ARTICLE';

// Add key/val pair to the Map obj where the key is the el and the value is the element's state
// elementStates.set(testSelector, {});



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