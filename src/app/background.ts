console.log('Running background script');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background got a message!');
  sendResponse({});
});