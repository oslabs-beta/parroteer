chrome.runtime.sendMessage({}, (response) => {
  const checkReady = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(checkReady);
      console.log('We\'re in the injected content script!');
    }
  });
});