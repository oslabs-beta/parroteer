// mutation observer
// Select the node that will be observed for mutations
export const targetNode = document.querySelector('body');
// Options for the observer (which mutations to observe)
export const config = { attributes: true, childList: true, subtree: true, characterData: true, attributeOldValue: true, characterDataOldValue: true };

// Callback function to execute when mutations are observed
const callback: MutationCallback = function(mutationList, observer) {
    // Use traditional 'for loops' for IE 11npm

  // will mutationlist contain all mutations or only per recording period?
  // stretch - users input attribute to select and change
  for(const mutation of mutationList) {

    if (mutation.type === 'childList') {
      console.log('A child node has been added or removed.');
      console.log(`%c${'CHILDIST MUTATION'}`, 'background-color: red');
      console.log(mutation);
    }
    else if (mutation.type === 'attributes' && mutation.attributeName !== 'style') {
      
      console.log('The ' + mutation.attributeName + ' attribute was modified.');
      console.log(`%c${'ATTRIBUTE MUTATION '}`, 'background-color: aqua');
      console.log(mutation);
    } else if (mutation.type === 'characterData'){
      console.log(`%c${'characterData'}`, 'background-color: maroon');
      console.log(mutation);
    }
  }
} ;



// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

export default observer;
// Start observing the target node for configured mutations
// observer.observe(targetNode, config);

// Later, you can stop observing
// observer.disconnect();