document.addEventListener('DOMContentLoaded', function() {

  // https://stackoverflow.com/questions/25588188/trying-to-communicate-from-default-script-to-content-script-in-chrome-extension

  // ask whether the switch is on
  chrome.tabs.query({currentWindow: true, active: true}, function(tabArray) {
    chrome.tabs.sendMessage(tabArray[0].id, {"getSwitch": true}, setSwitch);
  });

  // change switch state on click
  document.getElementById('button-on').addEventListener("click",function() {
    chrome.tabs.query({currentWindow: true, active: true},function(tabArray) {
      chrome.tabs.sendMessage(tabArray[0].id,{"setSwitch": true}, setSwitch);
    });
  });

  function setSwitch(response) {
    if (response.toggleState == true) {
      document.getElementById('checkbox').checked = true
      document.getElementById('slider').setAttribute("style", "background-color: #202124;")
    } else {
      document.getElementById('checkbox').checked = false
      document.getElementById('slider').setAttribute("style", "background-color: #ccc;")
    }
  }

  // listener for toggling button
  // var button = document.getElementById('button-on');
  // button.addEventListener('click', function () {
  //   console.log("clicked")
  //   toggleSwitch = !toggleSwitch
  //
  //   chrome.storage.sync.set({ switch: toggleSwitch }, function() {
  //     // actions to do if extension is toggled
  //     if (toggleSwitch == true) {
  //       console.log("switch on")
  //       button.setAttribute("style", "background-color:pink;")
  //     }
  //   });
  // });
});

// https://stackoverflow.com/questions/25588188/trying-to-communicate-from-default-script-to-content-script-in-chrome-extension
