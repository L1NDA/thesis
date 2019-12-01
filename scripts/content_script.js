// https://stackoverflow.com/questions/3731328/on-text-highlight-event

function debounce(fn, delay) {
  let timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
};

function selectionListener(event) {
  debounce(function (event) {
    let selection = document.getSelection ? document.getSelection().toString() :  document.selection.createRange().toString() ;
    if (selection) {
      console.log(selection);
    }
  }, 250);
}

document.addEventListener('DOMContentLoaded', function() {

  var toggleSwitch = false;

  // see whether button is already on
  chrome.storage.sync.get('switch', function(resp) {
      if (resp.switch) {
        toggleSwitch = resp.switch
        document.getElementById('button-on').setAttribute("style", "background-color:pink;")
      }
  });

  chrome.runtime.onMessage.addListener(function(request,sender,sendResponse) {
      if (request.setSwitch) {
          toggleSwitch = !toggleSwitch
          chrome.storage.sync.set({"switch": toggleSwitch});
          sendResponse({"finished": true, "toggleState": toggleSwitch});
      } else if ( request.getSwitch ) {
          sendResponse({"finished": true, "toggleState": toggleSwitch});
      }
  });

  // get selection
  document.addEventListener("selectionchange", selectionListener)

})

// chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.method == "getSelection")
//     sendResponse({data: window.getSelection().toString()});
//   else
//     sendResponse({}); // snub them.
// });
