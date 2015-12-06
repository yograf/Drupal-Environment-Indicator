chrome.storage.sync.get(url, function(data) {
  document.querySelector('#admin-menu').style.transitionDuration = ".5s";
  document.querySelector('#admin-menu').style.background = data[url].background;
  [].forEach.call(document.querySelectorAll('#admin-menu-wrapper > ul > li > a'), function(el){
    el.style.color = data[url].foreground;
  })
});

