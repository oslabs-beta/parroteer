import { CssSelector } from '../../types/Events';

export default function getSelector(target: EventTarget, height = 4) { // EventTarget could be: Element, Document, Window
  if (!(target instanceof Element)) return;
  const selectors: CssSelector[] = [];

  let currElement = target;
  for (let i = 0; i < height; i++) {
    let elSelector: CssSelector;

    if (currElement.id)
      elSelector = '#' + currElement.id;
    else if (currElement.classList?.value)
      elSelector = '.' + currElement.classList.value.trim().replace(/\s+/g, '.');
    else
      elSelector = currElement.tagName.toLowerCase();

    // TODO: Check if element has any siblings with the same selector


    selectors.unshift(elSelector);

    // If element had an id or we've reached the body, we can't go up any higher
    if (currElement.id || currElement.tagName === 'BODY') break;

    // On each iteration, grab the parent node and tell Typescript its going to be an Element, not Document or Window
    currElement = currElement.parentNode as Element;
  }

  return selectors.join(' > ');
}
