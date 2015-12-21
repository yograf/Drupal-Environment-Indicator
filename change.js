var hideAdminMenu = function(el) {
  var rect = el.getBoundingClientRect();
  var orgTop = rect.top;
  var newTop = el.style.top = 0 - (rect.bottom - 8) + "px";
  var showMenuTimeout, hideMenuTimeout;
  el.addEventListener("mouseenter", function() {
    clearTimeout(hideMenuTimeout);
    showMenuTimeout = setTimeout(function() {
      el.style.top = orgTop;
    }, 80);
  });
  el.addEventListener("mouseleave", function() {
    clearTimeout(showMenuTimeout);
    hideMenuTimeout = setTimeout(function() {
      el.style.top = newTop;
    }, 1500);
  });
};
var colorAdminMenu = function() {
  chrome.storage.sync.get(url, function(data) {
    var adminMenu = document.querySelector('#admin-menu');
    var siteSettings = data[url];
    adminMenu.style.transitionDuration = ".7s";
    adminMenu.style.background = siteSettings.background;
    var adminPath = document.location.pathname.indexOf("/admin") > -1;
    if ((siteSettings.theme && !adminPath) || (siteSettings.adminTheme && adminPath)) {
      hideAdminMenu(adminMenu);
    }
    [].forEach.call(document.querySelectorAll('#admin-menu-wrapper > ul > li > a'), function(el){
      el.style.color = siteSettings.foreground;
    })
  });
};
// Admin menu can be cached on not be present on page load.
var timeoutFlag;
var waitingForAdminMenu = function() {
  if (!document.querySelector('#admin-menu')) {
    timeoutFlag = setTimeout(waitingForAdminMenu, 100);
  } else {
    clearTimeout(timeoutFlag);
    colorAdminMenu();
  }
};
waitingForAdminMenu();

