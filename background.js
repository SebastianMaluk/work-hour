// Open options page when user clicks the extension icon
const action = typeof browser !== 'undefined' ? browser.browserAction : chrome.browserAction;
const runtime = typeof browser !== 'undefined' ? browser.runtime : chrome.runtime;

action.onClicked.addListener((tab) => {
  runtime.openOptionsPage();
});