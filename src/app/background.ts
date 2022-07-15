import { ElementState, MutationEvent, ParroteerId, RecordingState, UserInputEvent } from '../types/Events';
import { RuntimeMessage } from '../types/Runtime';

// This script does not communicate with the DOM
console.log('Running background script (see chrome extensions page)');



/// Globals
let activeTabId: number;
let recordedTabId: number;
let recordingState: RecordingState = 'off';
const events: (UserInputEvent | MutationEvent)[] = [];

// Initialize object to track element states
const elementStates: { [key: ParroteerId]: ElementState } = {};

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((message: RuntimeMessage, sender, sendResponse) => {
  console.log('Background got a message!', message);

  switch (message.type) {
    case 'popup-opened':
      // setTimeout(() => console.log('this is something alright'));
      sendResponse({recordingState, recordedTabId, activeTabId});
      break;
    case 'begin-recording': {
      console.log('In begin-recording switch case');
      recordingState = 'recording';
      addRecordingListeners(recordingState);
      // disableHighlight();
      // beginRecording();
      break;
    }
    case 'begin-pick-elements': {
      recordingState = 'pre-recording';
      addRecordingListeners(recordingState);
      // enableHighlight();
      break;
    }
    case 'event-triggered': {
      // TODO: Check to make sure activeTabId is recordedTabId
      const { event, prevMutations } = message.payload as { event: UserInputEvent, prevMutations?: MutationEvent[] };
      switch (recordingState) {
        case 'pre-recording': {
          if (event.eventType === 'click') {
            // When an element is clicked in pre-recording (aka pick mode), track element and notify the content script
            const selector = event.selector;
            chrome.tabs.sendMessage( activeTabId, { type: 'watch-element', payload: selector },
              (elInfo: { state: ElementState, parroteerId: ParroteerId }) => {
                elementStates[elInfo.parroteerId] = elInfo.state;
                console.log('Picked elements:', elementStates);
              }
            );
          }
          break;
        }
        case 'recording': {
          // Message should include the event that occurred as well as any mutations that occurred prior to it
          if (prevMutations) events.push(...prevMutations);
          events.push(event);

          console.log('Current event log:', events);
          // TODO: Notify the popup of the event and any differences in element states
          // sendElementStates();
          break;
        }
      }
      break;
    }
    case 'pause-recording':
      break;
    case 'stop-recording':
      recordingState = 'off';
      stopRecordingListeners();
      // TODO: Get final states of elements. Just use diffElementStates() maybe?
      break;
  }
});


/**
 * Message the content script and instruct it to add event listeners and observer
 */
function addRecordingListeners(recState: RecordingState) {
  recordedTabId = activeTabId;
  console.log('ADDDING RECORDING LISTENERS FOR TABID', recordedTabId);
  chrome.tabs.sendMessage(recordedTabId, { type: 'add-listeners', payload: { recordingState: recState } });
}

function stopRecordingListeners() {
  console.log('Stopping RECORDING LISTENERS FOR TABID', recordedTabId);
  chrome.tabs.sendMessage(recordedTabId, { type: 'add-listeners', payload: { recordingState: 'off' } });
  recordedTabId = null;
}

/// Tab event listeners
// On change tabs: Set active tab id to current tab id
chrome.tabs.onActivated.addListener((activeInfo) => {
  activeTabId = activeInfo.tabId;
});