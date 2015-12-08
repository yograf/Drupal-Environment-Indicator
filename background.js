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
        chrome.storage.sync.get({"drupal_environment_urls":[]}, function(obj) {
          var newSite = true;
          for (var i=0; i < obj.drupal_environment_urls.length; i++) {
            if (host === obj.drupal_environment_urls[i].hostSuffix) {
              newSite = false;
              break;
            }
          }
          if (newSite) {
            obj.drupal_environment_urls.push({hostSuffix: host});
            chrome.storage.sync.set({"drupal_environment_urls": obj.drupal_environment_urls}, function() {
              chrome.webNavigation.onCommitted.removeListener(change);
              chrome.webNavigation.onCommitted.addListener(change, {url: obj.drupal_environment_urls });
            });
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

