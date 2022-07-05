import getSelector from './getSelector';

export function stopEventListeners() {
  document.removeEventListener('click', clickListener);
}

export function startEventListeners(){
  document.addEventListener('click', clickListener);
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