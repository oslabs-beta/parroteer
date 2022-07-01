import getSelector from './getSelector';

export function stopEventListeners() {
  document.removeEventListener('click', clickListener);
}

export function startEventListeners(){
  document.addEventListener('click', clickListener);
}

// event.isTrusted checks if event was created by user!
function clickListener(this: Document, event: MouseEvent) {
  // Listen for click
  // When click happens get info about the event for us to store
    // What do we need to store in order to re-create it in Puppeteer?
  const selector = getSelector(event.target);
  console.log(selector);
}