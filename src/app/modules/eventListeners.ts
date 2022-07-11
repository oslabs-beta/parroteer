import getSelector from './getSelector';

let recordingState = 'off';

export function stopEventListeners() {
  document.removeEventListener('click', clickListener);
}

export function startEventListeners(state: string) {
  // Remove old event listeners in case any are already there
  document.removeEventListener('click', clickListener);

  recordingState = state;
  console.log(`recordingState: ${recordingState}`)
  // console.log(state);
  // console.log(state === 'pre-recording');
  document.addEventListener('click', clickListener, {
    // return true if state is pre-recoriding, false otherwise
    capture: state === 'pre-recording'
  });
}

/*
event: MouseEvent

interface MouseEvent {
  target: EventTarget
}

type EventTarget = HTMLElement | Document
*/

// TODO: Write an event.isTrusted function that checks if event was created by user!

// Listen for click event
// When click happens get info about the event for us to store
  // NOTE: What do we need to store in order to re-create it in Puppeteer?
function clickListener(this: Document, event: MouseEvent) {
  if (recordingState === 'pre-recording') {
    event.stopPropagation();
    event.preventDefault();
  }
  
  const target = event.target as HTMLElement;
  const selector = getSelector(target);
  console.log('Element clicked:', selector);

  chrome.runtime.sendMessage({
    type: 'event-triggered',
    payload: {
      selector,
      eventType: event.type
    }
  });

  // TODO: Will need an array or DS to push all of our state changes into to create tests
  // TODO: Also watch for new nodes using MutationObserver
}