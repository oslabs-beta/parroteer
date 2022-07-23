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
let recordingURL: string;
let events: EventLog = [];

// Initialize object to track element states
let elementStates: { [key: ParroteerId]: ElementState } = {};

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((message: RuntimeMessage, sender, sendResponse) => {
  console.log('Background got a message!', message);

  switch (message.type) {
    case 'popup-opened':
      console.log(elementStates);
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

    case 'begin-pick-elements':
      recordingState = 'pre-recording';
      addRecordingListeners(recordingState);
      // enableHighlight();
      break;

    case 'event-triggered': {
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
          break;
        }
      }
      break;
    }

    case 'pause-recording':
      recordingState = 'off';
      stopRecordingListeners();
      console.log(events);
      tests = createTestsFromEvents(events, recordingURL);
      break;

    case 'stop-recording':
      lastElementStateDiff();
      recordingState = 'off';
      stopRecordingListeners();
      console.log(events);
      tests = createTestsFromEvents(events, recordingURL);
      // sendResponse(tests);
      break;

    case 'restart-recording':
      console.log('in restart recording');
      recordingState = 'off';
      tests = '';
      events = [];
      stopRecordingListeners(Object.keys(elementStates));
      elementStates = {};
      recordedTabId = null;
      break;

    case 'get-tests':
      sendResponse(tests);
      break;
  }
});


/**
 * Message the content script and instruct it to add event listeners and observer
 */
function addRecordingListeners(recState: RecordingState) {
  recordedTabId = recordedTabId || activeTabId;
  chrome.tabs.get(recordedTabId, (res) => recordingURL = res.url);
  console.log('ADDING RECORDING LISTENERS FOR TABID', recordedTabId);
  chrome.tabs.sendMessage(recordedTabId, { type: 'add-listeners', payload: { recordingState: recState } });
}

function stopRecordingListeners(arr?: string[]) {
  console.log('Stopping RECORDING LISTENERS FOR TABID', recordedTabId);
  chrome.tabs.sendMessage(recordedTabId, { type: 'add-listeners', payload: {idsToClear: arr, recordingState: 'off' } });
}

function lastElementStateDiff() {
  console.log(`%c${'Going INTO EVENTS'}`, 'background-color: green', events);
  chrome.tabs.sendMessage(recordedTabId, { type: 'final-diff'}, (res) => {
    console.log(res),
    events.push(...res);
  });
}

/// Tab event listeners
// On change tabs: Set active tab id to current tab id
chrome.tabs.onActivated.addListener((activeInfo) => {
  activeTabId = activeInfo.tabId;
});