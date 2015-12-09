
// Show drupal icon when needed.
chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          css: ["#admin-menu"]
        })
      ],
      actions: [
        new chrome.declarativeContent.ShowPageAction()
      ]
    }]);
  });
});

var getHost = function(url) {
  var urlObj = new URL(url);
  return urlObj.host;
};
var host =  function(tab) {
  chrome.tabs.executeScript(tab.tabId, {code: "var url = '" +  getHost(tab.url) + "'"}, function() {
    chrome.tabs.executeScript(tab.tabId, {file: "change.js"});
  });
}

var change = function(details) {
    if (!details.frameId) {
      host(details);
    }
};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (!request.background) {
      return;
    };
    chrome.tabs.query({
      active: true,
      windowType: "normal",
      lastFocusedWindow: true
    }, function(tabs) {
        var tab = tabs[0];
        var host = getHost(tab.url);
        chrome.storage.sync.get({host: false}, function(obj) {
          if (!obj[host]) {
          var t = {};
          var q = [{hostSuffix: host}];
          t["url"] = q;
            chrome.webNavigation.onDOMContentLoaded.addListener(change, t);
          }
        });
        var domain = {};
        domain[host] = request;
        chrome.storage.sync.set(domain, function() {
          chrome.tabs.executeScript(tab.id, {code: "var url = '" +  host + "'"}, function() {
            chrome.tabs.executeScript(tab.id, {file: "change.js"});
          });
        });
      });
  });

