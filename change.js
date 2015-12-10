
var colorAdminMenu = function() {
  chrome.storage.sync.get(url, function(data) {
    document.querySelector('#admin-menu').style.transitionDuration = ".5s";
    document.querySelector('#admin-menu').style.background = data[url].background;
    [].forEach.call(document.querySelectorAll('#admin-menu-wrapper > ul > li > a'), function(el){
      el.style.color = data[url].foreground;
    })
  });
};
var timeoutFlag;
// Admin menu can be cached on not be present on page load.
var waitingForAdminMenu = function() {
  if (!document.querySelector('#admin-menu')) {
    timeoutFlag = setTimeout(waitingForAdminMenu, 500);
  } else {
    clearTimeout(timeoutFlag);
    colorAdminMenu();
  }
};
waitingForAdminMenu();

