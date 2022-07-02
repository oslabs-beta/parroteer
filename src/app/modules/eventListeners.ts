import getSelector from './getSelector';

export function stopEventListeners() {
  document.removeEventListener('click', clickListener);
}

export function startEventListeners(){
  document.addEventListener('click', clickListener);
}

// const el = document.querySelector('article');

// Define the types in our elementState map obj
interface ElementState {
  class?: string,
  textContent?: string,
  value?: string
}

// Initialize a Map obj
const elementStates = new Map<HTMLElement, ElementState>();

// Add key/val pair to the Map obj where the key is the el and the value is the element's state
// elementStates.set(el, getCurrState(el));

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

  // Use array destructuring to check every el/state pair (treated like subarrays) in the map and find the differences between prev and curr state
    // the stored state in the map at this point is now the previous state
  for (const [el, prevState] of elementStates) {
    const curState = getCurrState(el);
    console.log(diffState(prevState, curState));
    elementStates.set(el, curState);
  }

  // TODO: Will need an array or DS to push all of our state changes into to create tests
  // TODO: Also watch for new nodes using MutationObserver
}

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