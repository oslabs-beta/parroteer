import getRelativeSelector from './getSelector';

// Hover over an element
// Add a highlight element / move highlight element on the page and copy the size and position of the element that was hovered
// Add background / border to highlight element
let highlightElement: HTMLElement;
let lilPopUp: HTMLElement;
/*
<div> <-- highlighter
  <span></span> <-- lilPopUp (Selector display)
<div>
*/

/**
 * Enable element highlighter
 */
export function enableHighlight() {
  if (highlightElement) highlightElement.remove();

  highlightElement = document.createElement('div');
  lilPopUp = document.createElement('span');
  // highlightElement.id = 'highlighter';

  // Style highlighter
  Object.assign(highlightElement.style, {
    backgroundColor: '#F8D13C55',
    color: '#425EA9',
    zIndex: '1000000',
    position: 'fixed',
    pointerEvents: 'none',
    border: '2px dashed rgba(66, 94, 169, 0.9)'
  });

  // Style popup
  Object.assign(lilPopUp.style, {
    position: 'absolute',
    bottom: 'calc(100% + 2px)',
    left: '50%',
    backgroundColor: '#ffc5baee',
    fontWeight: 'bold',
    width: 'max-content',
    borderRadius: '0.5em',
    padding: '0.1em 0.5em',
    fontSize: '1rem',
    transform: 'translateX(-50%)'
  });

  // Append highlighter to body
  document.body.appendChild(highlightElement);
  highlightElement.appendChild(lilPopUp);

  // Add event listers
  // (Remove old event listeners if present)
  document.removeEventListener('mouseover', hoverListener);
  document.addEventListener('mouseover', hoverListener);
  // TODO: Add mousemove and scroll events to track mouse position and update highlighted element based on calculated mouse position
/*   document.removeEventListener('scroll', hoverListener);
  document.addEventListener('scroll', hoverListener); */
}

/**
 * Disable element highlighter
 */
export function disableHighlight() {
  // document.removeEventListener('scroll', hoverListener);
  document.removeEventListener('mouseover', hoverListener);
  highlightElement.remove();
  // TODO: Remove highlighter from DOM
}

/**
 * Determines the position of an element that is hovered over, then assigns the highlight element to the same position
 */
function hoverListener(this: Document, event: MouseEvent) {
  const target = event.target as HTMLElement;
  // console.log(target);

  // Set height, width, left, top of highlight element
  // Adjust properties to account for 2px border
  const {height, width, left, top} = target.getBoundingClientRect();
  Object.assign(highlightElement.style, {
    height: `${height + 4}px`,
    width: `${width + 4}px`,
    left: `${left - 2}px`,
    top: `${top - 2}px`
  });
  
  // Call get selector and put into element
  lilPopUp.textContent = getRelativeSelector(target);
}

