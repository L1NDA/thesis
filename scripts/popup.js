

document.addEventListener('DOMContentLoaded', function() {

  // https://stackoverflow.com/questions/25588188/trying-to-communicate-from-default-script-to-content-script-in-chrome-extension

  // ask whether the switch is on
  chrome.tabs.query({currentWindow: true, active: true}, function(tabArray) {
    chrome.tabs.sendMessage(tabArray[0].id, {"getSwitch": true}, setSwitch);
  });

  // change switch state on click
  document.getElementById('button').addEventListener("click",function() {
    chrome.tabs.query({currentWindow: true, active: true},function(tabArray) {
      chrome.tabs.sendMessage(tabArray[0].id,{"setSwitch": true}, setSwitch);
    });
  });

  function setSwitch(response) {
    if (response.toggleState == true) {
      document.getElementById('button').classList.add("button-on");
      document.getElementById('button').innerHTML = "TOGGLE OFF";
      document.getElementById('status').innerHTML = "(Currently: On)";
    } else {
      document.getElementById('button').classList.remove("button-on");
      document.getElementById('button').innerHTML = "TOGGLE ON";
      document.getElementById('status').innerHTML = "(Currently: Off)";
    }
  }



});

// https://stackoverflow.com/questions/25588188/trying-to-communicate-from-default-script-to-content-script-in-chrome-extension
