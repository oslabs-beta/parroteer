// This script has access to the DOM

import * as listeners from './modules/eventListeners';
// import observer, {targetNode, config} from './modules/mutationObserver';
import { enableHighlight, disableHighlight } from './modules/elementPicker';
import { RuntimeMessage } from '../types/Runtime';
import { ElementState, RecordingState } from '../types/Events';

console.log('Running content script (see chrome devtools)');

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message: RuntimeMessage, sender, sendResponse) => {
  switch (message.type) {
    case 'add-listeners': {
      const { recordingState } = message.payload as { recordingState: RecordingState };
      listeners.startEventListeners(recordingState);
      if (recordingState === 'pre-recording') enableHighlight();
      else {
        disableHighlight();
        if (recordingState === 'off') listeners.stopEventListeners();
      }
      // observer.observe(targetNode, config);
      break;
    }
    case 'get-element-states': {
      // Iterate over all selectures in payload 
      // Look up those elements in the DOM and get their state
      const payload = message.payload as string[];
      const elementStates: { [key: string]: ElementState } = {};
      for (const selector of payload) {
        elementStates[selector] = listeners.getCurrState(selector);
      }

      // Send those states back to the background
      sendResponse(elementStates);
      break;
    }
    case 'watch-element': {
      const selector = message.payload as string;
      const elState = listeners.watchElement(selector);
      sendResponse(elState);
      break;
    }
  }
});
