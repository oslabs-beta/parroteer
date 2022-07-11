// This script does not communicate with the DOM
console.log('Running background script (see chrome extensions page)');

/// Globals
let activeTabId: number;
let recordedTabId: number;
let recordingState: RecordState = 'off';
const events: (UserInputEvent | Mutation)[] = [];

type RecordState = 'pre-recording' | 'recording' | 'off';

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

interface UserInputEvent extends StoredEvent {
  eventType: string
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

interface RuntimeMessage {
  type: string,
  payload?: unknown
}

// Initialize a Map obj
const elementStates: { [key: CSSSelector]: ElementState } = {};

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((message: RuntimeMessage, sender, sendResponse) => {
  console.log('Background got a message!', message);

  switch (message.type) {
    case 'begin-recording':
      console.log('In begin-recording switch case');
      recordingState = 'recording';
      addRecordingListeners(recordingState);
      // disableHighlight();
      // beginRecording();
      break;
    case 'begin-pick-elements':
      recordingState = 'pre-recording';
      addRecordingListeners(recordingState);
      // enableHighlight();
      break;
    case 'event-triggered':
      // TODO: Check to make sure activeTabId is recordedTabId
      const payload = message.payload as Omit<UserInputEvent, 'type'>;
      switch (recordingState) {
        case 'pre-recording': {
          if (payload.eventType === 'click') {
            const selector = payload.selector;
            chrome.tabs.sendMessage(activeTabId, { type: 'get-element-states', payload: [selector] }, (currStates: { [key: string]: ElementState }) => {
              elementStates[selector] = currStates[selector];
            });
            console.log('Picked elements:', elementStates);
          }
          break;
        }
        case 'recording': {
          // Diff the state of all tracked elements
          diffElementStates();
          // Track the event that happened
          storeEvent(payload);

          console.log('Current event log:', events);
          // TODO: Notify the popup of the event and any differences in element states
          // sendElementStates();
          break;
        }
      }
      break;
    case 'pause-recording':
      break;
    case 'stop-recording':
      recordingState = 'off';
      // TODO: Get final states of elements. Just use diffElementStates() maybe?
      break;
  }
  // sendResponse({});
});

// TODO: Create data structure to track events and element changes

function diffElementStates() {
  // Message content script to request the current state for all tracked elements
  chrome.tabs.sendMessage(activeTabId, { type: 'get-element-states', payload: Object.keys(elementStates) }, (currStates: { [key: string]: ElementState }) => {
    for (const selector in currStates) {
      const currState = currStates[selector];
      const prevState = elementStates[selector];

      // Store element changes
      const changedState = diffState(prevState, currState);
      if (changedState) {
        console.log(`Watched element "${selector}" changed state. New properties:`, changedState);
        events.push({
          type: 'mutation',
          ...changedState,
          selector
        });
      }
      
      // TODO: Show whether stuff was added or removed?
      elementStates[selector] = currState;
    }
  });
}


function storeEvent(eventInfo: Omit<UserInputEvent, 'type'>) {
  events.push({
    ...eventInfo,
    type: 'input'
  });
}


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
function addRecordingListeners(recState: RecordState) {
  recordedTabId = activeTabId;
  chrome.tabs.sendMessage(recordedTabId, { type: 'add-listeners', payload: { recordingState: recState } });
}

/// Tab event listeners
// On change tabs: Set active tab id to current tab id
chrome.tabs.onActivated.addListener((activeInfo) => {
  activeTabId = activeInfo.tabId;
});