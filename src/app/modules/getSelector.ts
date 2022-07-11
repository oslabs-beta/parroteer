export default function getSelector(target: EventTarget) { // EventTarget could be: Element, Document, Window
  if (!(target instanceof Element)) return;
  let selector = '';

  let currElement = target;
  for (let i = 0; i <= 3; i++) {
    if (i !== 0) selector = ' > ' + selector;

    if (currElement.id) {
      selector = '#' + currElement.id + selector;
      return selector;
      // TODO: If there is another element with the same id, warn the user
    }
    else if (currElement.classList?.value) {
      console.log(currElement.classList.value);   selector = '.' + currElement.classList.value.trim().replace(/\s+/g, '.') + selector;
    }
    else {
      // Use tag name
      selector = currElement.tagName.toLowerCase() + selector;
    }

    // If we've reached the body, we can't go up any higher
    if (currElement.tagName === 'BODY') return selector;

    // On each iteration, grab the parent node and tell Typescript its going to be an Element, not Document or Window
    currElement = currElement.parentNode as Element;
  }
  return selector;
}
