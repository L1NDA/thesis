// https://stackoverflow.com/questions/3731328/on-text-highlight-event

var toggleSwitch = false;
var allVars = Object();

// looking for a variable to highlight
var onVariable = false;
var onDefinition = false;

// Adds UI to popup to allow for view/edit of all saved variables

function syncDefinitions() {
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.set({'count': Object.keys(allVars).length});
}

// Thank you James Padolsey for solving this problem I spent 8 hours cracking!!

function saveVariable() {
  syncDefinitions()

  let saveVar = document.getElementById("var-text").textContent
  let saveDef = document.getElementById("def-input").value
  allVars[saveVar] = saveDef

  // remove definition and tooltip
  let container = document.getElementById("var-container")
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  container.remove()
  document.getElementById('tooltip-span').innerHTML = "Saved."
  setTimeout(function(){
    document.getElementById('tooltip-span').remove()
  }, 1000);
  onVariable = false

  findAndReplaceDOMText(document.body, {
    preset: 'prose',
    find: saveVar,
    wrap: 'span',
    wrapClass: saveVar
  })

  let definedVars = document.getElementsByClassName(saveVar);

  for (i = 0; i < definedVars.length; i++) {
    definedVars[i].addEventListener("mouseover", function() {
      let tooltipSpan = document.createElement("div")
      tooltipSpan.id = `tooltip-span-${saveVar}-${i}`
      tooltipSpan.innerHTML = "Definition: " + saveDef

      window.onmousemove = function (e) {
          var x = e.clientX,
              y = e.clientY;
          tooltipSpan.style.top = (y + 20) + 'px';
          tooltipSpan.style.left = (x + 20) + 'px';
      };

      tooltipSpan.setAttribute("style", "display: block; position: fixed; overflow: hidden; background-color: rgba(156, 187, 242, 1); font-size: 10px; color: white; padding: 4px 8px; border-radius: 4px")

      document.body.appendChild(tooltipSpan)
    })
    definedVars[i].addEventListener("mouseout", function() {
      document.getElementById(`tooltip-span-${saveVar}-${i}`).remove()
    })
  }
}

function handleMouseUp(e) {
  if (toggleSwitch) {

    var t = document.getSelection ? document.getSelection().toString() :  document.selection.createRange().toString() ;

    // check if the click was on the add button; if not, removes previous overlay
    if (e.path[0].id != "add-button") {
      var prevAddButton = document.getElementById("add-button");

      if (prevAddButton) {
        document.getElementById("add-button").remove()
        document.getElementById("popup-container").remove()
        onVariable = false;
      }
    }

    // highlight is valid (not empty)
    if (t && t.trim()) {

      // no definition added
      if (!onVariable && !onDefinition) {

        // https://stackoverflow.com/questions/1589721/get-selected-text-position-and-place-an-element-next-to-it
        var r = window.getSelection().getRangeAt(0).getBoundingClientRect();
        var relative = document.body.parentNode.getBoundingClientRect();

        // create popup container
        let popup = document.createElement("div")
        popup.setAttribute("id", "popup-container")
        popup.setAttribute("style", "display: flex; justify-content: center")
        popup.style.top = (r.top - relative.top - 20)+'px'; //this will place ele below the selection
        popup.style.right = -(r.right - relative.right + 24)+'px'; //this will align the right edges together
        popup.style.position = "absolute";

        // add button styling
        let addButton = document.createElement("div");
        addButton.setAttribute("id", "add-button")
        addButton.setAttribute("style", "border-radius: 12px; margin-right: 4px; height: 20px; width: 20px; color: white; background-color: #424242; display: flex; align-items: center; justify-content: center; font-size: 12px; font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, Arial, sans-serif;")
        addButton.innerHTML = "+";

        // color change on hover
        addButton.addEventListener("mouseover", function() {
          addButton.style.backgroundColor = "black";
          addButton.style.cursor = "pointer";
        });
        addButton.addEventListener("mouseout", function() {
          addButton.style.backgroundColor = "#424242";
          addButton.style.cursor = "default";
        });

        popup.insertBefore(addButton, popup.firstChild);
        document.body.appendChild(popup);

        // add UI on click
        addButton.addEventListener("click", function() {

          var tempVar = t

          // https://stackoverflow.com/questions/52700090/how-to-create-multiple-elements-by-dom-in-vanilla-javascript
          let container = document.createElement("div");
          container.id = "var-container"

          let varLine = document.createElement("div");

          let defLine = document.createElement("div");

          let varLabel = document.createElement("b");
          varLabel.innerHTML = "Variable: ";
          varLabel.style.padding = " 0 4px 0 0"
          let varText = document.createElement("div");
          varText.innerHTML = tempVar;
          varText.id = "var-text";

          let defLabel = document.createElement("b");
          defLabel.innerHTML = "Definition: ";
          let defInput = document.createElement("input");
          defInput.id = "def-input";
          defInput.placeholder = `Highlight new text to autopopulate this field`

          let responseButtons = document.createElement("div");
          let deleteButton = document.createElement("button");
          deleteButton.innerHTML = "CANCEL"

          deleteButton.addEventListener("click", function() {
            let container = document.getElementById("var-container")
            while (container.firstChild) {
              container.removeChild(container.firstChild);
            }
            container.remove()
            document.getElementById('tooltip-span').remove()
            onVariable = false
          })

          let submitButton = document.createElement("button");
          submitButton.innerHTML = "SAVE"

          submitButton.addEventListener("click", function() {
            saveVariable()
          })

          varLine.appendChild(varLabel)
          varLine.appendChild(varText)
          container.appendChild(varLine)

          defLine.appendChild(defLabel)
          defLine.appendChild(defInput)
          container.appendChild(defLine)

          responseButtons.appendChild(deleteButton)
          responseButtons.appendChild(submitButton)
          container.appendChild(responseButtons)

          varLine.setAttribute("style", "display: flex; flex-direction: row")

          container.setAttribute("style", "display: flex; flex-direction: column; align-items: space-evenly; padding: 28px 28px; justify-content: center; text-align: left; border-radius: 4px; border: 3px solid #424242; background-color: white; font-size: 12px; font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, Arial, sans-serif; color: black; position: fixed; top: 4px; right: 4px; z-index: 24601")

          defInput.setAttribute("style", "width: 200px; resize: none; outline: none; box-shadow: none; border: none; border-bottom: 1px solid #424242; margin-left: 4px; padding-bottom: 2px; text-align: left; background-color: none; font-size: 10px; font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, Arial, sans-serif;")

          defLine.setAttribute("style", "display: flex; align-items: center; flex-grow: 1")

          deleteButton.setAttribute("style", "border-radius: 2px; padding: 4px 10px; font-weight: bold; background-color: white; border: 1px solid #424242; color: #424242; font-size: 10px; font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, Arial, sans-serif;")

          submitButton.setAttribute("style", "border-radius: 2px; padding: 4px 10px; font-weight: bold; background-color: #424242; border: 1px solid #424242; color: white; font-size: 10px; font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, Arial, sans-serif;")

          responseButtons.setAttribute("style", "display: flex; align-items: center; justify-content: space-evenly; margin-top: 14px")

          document.body.appendChild(container)

          // change tooltip

          let tooltipSpan = document.createElement("div")
          tooltipSpan.id = "tooltip-span"
          tooltipSpan.innerHTML = "Highlight text to add a definition"

          // listen for typing in textbox
          document.addEventListener("keyup", function(e) {
            if (document.getElementById("def-input").value) {
              tooltipSpan.innerHTML = "Press [enter] to save or [del] to redo"
            }

            if (e.key == "Enter") {
              saveVariable()
            } else if (e.key == "Backspace" && document.activeElement !== document.getElementById("def-input")) {
              document.getElementById("def-input").value = ""
            }
          })

          window.onmousemove = function (e) {
              var x = e.clientX,
                  y = e.clientY;
              tooltipSpan.style.top = (y + 20) + 'px';
              tooltipSpan.style.left = (x + 20) + 'px';
          };

          tooltipSpan.setAttribute("style", "display: block; position: fixed; overflow: hidden; background-color: #424242; font-size: 10px; color: white; padding: 4px 8px; border-radius: 4px")

          document.body.appendChild(tooltipSpan)

          document.getElementById("add-button").remove()
          document.getElementById("popup-container").remove()

          // !create display for variable
          // !remove plus sign
          // ! option to delete variable

          // ! https://stackoverflow.com/questions/15702867/html-tooltip-position-relative-to-mouse-pointer
          // create highlight definition flow
          // create edit definition flow
          // save set to Chrome

          // chrome.storage.sync.set({"switch": toggleSwitch});
        })

        onVariable = true

      }

      // saving a highlighted definition
      else if (onVariable && !onDefinition) {
        var definition = t
        document.getElementById("def-input").value = definition
        document.getElementById("tooltip-span").innerHTML = "Press [enter] to save or [del] to redo"
      }

    }

  } else {
    if (document.getElementById("add-button") !== null) {
      document.getElementById("add-button").remove()
    }
    if (document.getElementById("popup-container") !== null) {
      document.getElementById("popup-container").remove()
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {

  // see whether button is already on
  chrome.storage.sync.get('switch', function(resp) {
      if (resp.switch) {
        toggleSwitch = resp.switch
      }
  });

  // open listener for asking + getting messages
  chrome.runtime.onMessage.addListener(function(request,sender,sendResponse) {
      if (request.setSwitch) {
          toggleSwitch = !toggleSwitch
          chrome.storage.sync.set({"switch": toggleSwitch}, function() {
            sendResponse({"finished": true, "toggleState": toggleSwitch})
          });
      } else if (request.getSwitch) {
          sendResponse({"finished": true, "toggleState": toggleSwitch});
      }
      return true;
  });


  chrome.storage.sync.set({'count': 0});

  var allVars = new Object()

  // get existing variables saved
  // chrome.storage.sync.get('vars', function(resp) {
  //     if (resp.allVars) {
  //       allVars = resp.allVars
  //     } else {
  //       allVars = new Object()
  //     }
  // });

  // get selection
  document.addEventListener("mouseup", handleMouseUp)

})
