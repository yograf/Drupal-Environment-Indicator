$(function (){
  var sendColor = function() {
    var message = {
      background: $("#color1").val(),
      foreground: $("#color2").val(),
      theme: $("#theme").is(":checked"),
      adminTheme: $("#admin-theme").is(":checked")
    };
    chrome.runtime.sendMessage(message);
  };

  var backgroundFarb = $.farbtastic('#colorpicker1',{callback: '#color1', width: 200, height: 200});
  $("#colorpicker1").mouseup(function () {sendColor()});

  $("#theme, #admin-theme").click(function() {
    sendColor();
  });

  var foregroundFarb = $.farbtastic('#colorpicker2',{callback: '#color2', width: 200, height: 200});
  $("#colorpicker2").mouseup(function () {sendColor();});

  var getHost = function(url) {
    var urlObj = new URL(url);
    return urlObj.host;
  };

  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  },
  function(tabs) {
    var tab = tabs[0];
    var host = getHost(tab.url);
    var defaultSettings = {};
    defaultSettings[host] = {background: "#123456", foreground: "#fff", theme: false, adminTheme: false};
    chrome.storage.sync.get(defaultSettings, function(data) {
      backgroundFarb.setColor(data[host].background);
      foregroundFarb.setColor(data[host].foreground);
      $("#theme").attr('checked', data[host].theme);
      $("#admin-theme").attr('checked', data[host].adminTheme);
    });
  });




});
