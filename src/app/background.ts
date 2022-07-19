import { ElementState, EventLog, MutationEvent, ParroteerId, RecordingState, UserInputEvent, PickedElementEvent } from '../types/Events';
import { RuntimeMessage } from '../types/Runtime';
import createTestsFromEvents from './modules/generateTests';
// import senfFinalElements from './modules/generateTests';

// This script does not communicate with the DOM
console.log('Running background script (see chrome extensions page)');



/// Globals
let activeTabId: number;
let recordedTabId: number;
let recordingState: RecordingState = 'off';
let tests = '';
const events: EventLog = [];

// Initialize object to track element states
const elementStates: { [key: ParroteerId]: ElementState } = {};

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((message: RuntimeMessage, sender, sendResponse) => {
  console.log('Background got a message!', message);

  switch (message.type) {
    case 'popup-opened':
      // setTimeout(() => console.log('this is something alright'));
      sendResponse({recordingState, recordedTabId, activeTabId, elementStates, events, tests});
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
            if (activeTabId !== recordedTabId) {
              throw new Error('Cannot pick elements on wrong tab');
            }
            const selector = event.selector;

            // {type: 'picked-element event, parroteerId, initalSelector}

            chrome.tabs.sendMessage( recordedTabId, { type: 'watch-element', payload: selector },
              (elInfo: { state: ElementState, parroteerId: ParroteerId }) => {
                elementStates[elInfo.parroteerId] = elInfo.state;
                const pickedElementEvent: PickedElementEvent = {
                  type: 'picked-element',
                  displaySelector: event.displaySelector,
                  selector: event.selector,
                  parroteerId: elInfo.parroteerId
                };
                events.push(pickedElementEvent);
                console.log('Picked elements:', elementStates);
              }
            );

          }

          break;
        }
        case 'recording': {
          // Message should include the event that occurred as well as any mutations that occurred prior to it

          if (prevMutations) events.push(...prevMutations);
          console.log('prevMutations', prevMutations);
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
      lastElementStateDiff();
      stopRecordingListeners();
      tests = createTestsFromEvents(events);
      sendResponse(tests);
      break;
  }
});


/**
 * Message the content script and instruct it to add event listeners and observer
 */
function addRecordingListeners(recState: RecordingState) {
  recordedTabId = recordedTabId || activeTabId;
  console.log('ADDDING RECORDING LISTENERS FOR TABID', recordedTabId);
  chrome.tabs.sendMessage(recordedTabId, { type: 'add-listeners', payload: { recordingState: recState } });
}

function stopRecordingListeners() {
  console.log('Stopping RECORDING LISTENERS FOR TABID', recordedTabId);
  chrome.tabs.sendMessage(recordedTabId, { type: 'add-listeners', payload: { recordingState: 'off' } });
  recordedTabId = null;
}

function lastElementStateDiff() {
  console.log('LAST STATE DIFF');
  // TODO: check if syntax with res is correct
  chrome.tabs.sendMessage(recordedTabId, { type: 'final-diff'}, (res) => events.push(...res));
}

/// Tab event listeners
// On change tabs: Set active tab id to current tab id
chrome.tabs.onActivated.addListener((activeInfo) => {
  activeTabId = activeInfo.tabId;
});