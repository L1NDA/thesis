function on() {
  console.log("on!");
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {joke: "knock knock"}, function(response) {
          console.log('success');
      });
  });
}

document.addEventListener('DOMContentLoaded', function() {

  // https://stackoverflow.com/questions/25588188/trying-to-communicate-from-default-script-to-content-script-in-chrome-extension

  chrome.tabs.query({currentWindow: true, active: true}, function(tabArray) {
    console.log("making query")
    chrome.tabs.sendMessage(tabArray[0].id, {"getSwitch": true}, setBackgroundColor);
  });

  document.getElementById('button-on').addEventListener("click",function() {
    chrome.tabs.query({currentWindow: true, active: true},function(tabArray) {
      chrome.tabs.sendMessage(tabArray[0].id,{"setSwitch": true}, setBackgroundColor);
    });
  });

  function setBackgroundColor(response) {
    console.log("in helper function")
    if (response.toggleState == true) {
      document.getElementById('button-on').setAttribute("style", "background-color:pink;")
    } else {
      document.getElementById('button-on').setAttribute("style", "background-color:none;")
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
