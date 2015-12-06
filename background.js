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
chrome.storage.sync.get("drupal_environment_urls", function(obj) {
  chrome.webNavigation.onCommitted.addListener(function(details) {
    host(details);
  }, {url: obj.drupal_environment_urls });
});

//chrome.storage.sync.set({"drupal_environment_settings": {"back": "54545", "front": "6666"}});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (Object.keys(request)[0] !== "background") {
      return;
    };
    chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    }, function(tabs) {
        var tab = tabs[0];
        var host = getHost(tab.url);
        chrome.storage.sync.get("drupal_environment_urls", function(obj) {
          var newSite = true;
          for (var i=0; i < obj.drupal_environment_urls.length; i++) {
            if (host === obj.drupal_environment_urls[i].hostSuffix) {
              newSite = false;
              break;
            }
          }
          if (newSite) {
            obj.drupal_environment_urls.push({hostSuffix: host});
            chrome.storage.sync.set({"drupal_environment_urls": obj.drupal_environment_urls});
          }
        });
        var domain = {};
        domain[host] = request;
      chrome.storage.sync.set(domain, function() {
        chrome.tabs.executeScript(null, {code: "var url = '" +  host + "'"}, function() {
          chrome.tabs.executeScript(null, {file: "change.js"});
        });
      });
    });
  });

