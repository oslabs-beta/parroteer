import { CssSelector } from '../../types/Events';

/**
 * Builds a relative selector for a given element, based on properties of itself and its parents
 * @param target The target element
 * @param height How many parents above the element to check. `height` of 0 means only check given element. Default 3
 */
export default function getRelativeSelector(target: EventTarget, height = 3) { // EventTarget could be: Element, Document, Window
  if (!(target instanceof Element)) return;
  const selectors: CssSelector[] = [];

  let currElement = target;

  for (let i = 0; i <= height; i++) {
    let elSelector = getSimpleSelector(currElement);

    // Check if element has any siblings with the same selector
    // If so, add 'nth-of-type' pseudoselector
    elSelector += getNthTypeSelector(currElement) || '';

    selectors.unshift(elSelector);

    // If element had an id or we've reached the body, we can't go up any higher
    if (currElement.id || currElement.tagName === 'BODY') break;

    // On each iteration, grab the parent node and tell Typescript its going to be an Element, not Document or Window
    currElement = currElement.parentElement;
  }

  return selectors.join(' > ');
}

/**
 * Gets a simple selector for a single element, using the most specific identifier available  
 * In order of preference: id > class > tag
 */
export function getSimpleSelector(element: Element): CssSelector {
  return (
    element.id ? '#' + element.id
    : element.classList?.value ? '.' + element.classList.value.trim().replace(/\s+/g, '.')
    : element.tagName.toLowerCase()
  );
}

/**
 * If an element has sibling elements which would match it's simple selector,
 * generates a pseudoselector in the form of `:nth-of-type(n)`.  
 * If element has no siblings, returns null
 */
export function getNthTypeSelector(element: Element): CssSelector | null {
  const elSelector = getSimpleSelector(element);
  const selMatcher = new RegExp(elSelector);

  let childIndex = 0, hasTwin = false;
  for (const sibling of element.parentElement.children) {
    if (sibling === element) break;

    const siblingSelector = getFullSelector(sibling);
    if (siblingSelector.match(selMatcher)) {
      childIndex++;
      hasTwin = true;
    }
  }
  return (hasTwin ? `:nth-of-type(${childIndex + 1})` : null);
}

/**
 * Gets as full of a selector as possible for a given element. Does not include pseudoselectors
 * *e.g.* `div#someId.class1.class2`
 */
export function getFullSelector(element: Element): CssSelector {
  let selector = getTagSelector(element);
  if (element.id) selector += getIdSelector(element);
  if (element.classList?.value) selector += getClassSelector(element);
  return selector;
}

function getIdSelector(element: Element): CssSelector {
  return '#' + element.id;
}

function getClassSelector(element: Element): CssSelector {
  return '.' + element.classList.value.trim().replace(/\s+/g, '.');
}

function getTagSelector(element: Element): CssSelector {
  return element.tagName.toLowerCase();
}