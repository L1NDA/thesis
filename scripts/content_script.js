// https://stackoverflow.com/questions/3731328/on-text-highlight-event

var toggleSwitch = false;
var allVars;
var onVariable = false;
var onDefinition = false;

function handleMouseUp(e) {
  if (toggleSwitch) {

    var t = document.getSelection ? document.getSelection().toString() :  document.selection.createRange().toString() ;

    // check if the click was on the add button
    if (e.path[0].id != "add-button") {
      var prevAddButton = document.getElementById("add-button");

      if (prevAddButton) {
        document.getElementById("add-button").remove();
        onVariable = false;
      }
    }

    // highlight is valid
    if (t && t.trim()) {

      if (!onVariable && !onDefinition) {

        // https://stackoverflow.com/questions/1589721/get-selected-text-position-and-place-an-element-next-to-it
        var r = window.getSelection().getRangeAt(0).getBoundingClientRect();
        var relative = document.body.parentNode.getBoundingClientRect();

        // add button styling
        let addButton = document.createElement("div");
        addButton.setAttribute("id", "add-button")
        addButton.setAttribute("style", "border-radius: 12px; height: 20px; width: 20px; color: white; background-color: #9CBBF2; display: flex; align-items: center; justify-content: center; font-size: 12px; font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, Arial, sans-serif;")
        addButton.style.top = (r.top - relative.top - 16)+'px'; //this will place ele below the selection
        addButton.style.right = -(r.right - relative.right + 9)+'px'; //this will align the right edges together
        addButton.innerHTML = "+";
        addButton.style.position = "absolute";

        // color change on hover
        addButton.addEventListener("mouseover", function() {
          addButton.style.backgroundColor = "#6391EF";
          addButton.style.cursor = "pointer";
        });
        addButton.addEventListener("mouseout", function() {
          addButton.style.backgroundColor = "#9CBBF2";
          addButton.style.cursor = "default";
        });

        document.body.appendChild(addButton);

        // add button on click
        addButton.addEventListener("click", function() {

          tempVar = t

          // https://stackoverflow.com/questions/52700090/how-to-create-multiple-elements-by-dom-in-vanilla-javascript
          let container = document.createElement("div");
          container.id = "var-container";

          let varLine = document.createElement("div");
          varLine.id = "var-line";

          let defLine = document.createElement("div");
          defLine.id = "def-line";

          let varLabel = document.createElement("b");
          varLabel.innerHTML = "Variable: ";
          let varText = document.createTextNode(tempVar);

          let defLabel = document.createElement("b");
          defLabel.innerHTML = "Definition:";
          let defInput = document.createElement("textarea");
          defInput.id = "def-input";
          defInput.placeholder = `Highlight new text to autopopulate this field, or type here`

          varLine.appendChild(varLabel)
          varLine.appendChild(varText)
          container.appendChild(varLine)

          defLine.appendChild(defLabel)
          defLine.appendChild(defInput)
          container.appendChild(defLine)

          container.setAttribute("style", "height: 70px; width: 300px; text-align: left; border-radius: 4px; border: 3px solid #9CBBF2; background-color: white; padding: 6px 8px; font-size: 12px; font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, Arial, sans-serif; color: black; position: fixed; top: 4px; right: 4px; z-index: 24601")

          defInput.setAttribute("style", "height: 15px; width: 215px; resize: none; outline: none; box-shadow: none; border: none; border-bottom: 1px solid #9CBBF2; margin-left: 4px; padding-bottom: 4px; text-align: left; background-color: none")

          defLine.setAttribute("style", "display: flex; align-items: center")

          document.body.appendChild(container)

          addButton.remove()

          // !create display for variable
          // !remove plus sign
          // option to delete variable

          // https://stackoverflow.com/questions/15702867/html-tooltip-position-relative-to-mouse-pointer
          // create highlight definition flow
          // create edit definition flow
          // save set to Chrome

          // chrome.storage.sync.set({"switch": toggleSwitch});
        })

        onVariable = true

      }

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

  // get existing variables saved
  chrome.storage.sync.get('vars', function(resp) {
      if (resp.allVars) {
        allVars = resp.allVars
      } else {
        allVars = new Object()
      }
  });

  chrome.runtime.onMessage.addListener(function(request,sender,sendResponse) {
      if (request.setSwitch) {
          toggleSwitch = !toggleSwitch
          chrome.storage.sync.set({"switch": toggleSwitch}, function() {
            sendResponse({"finished": true, "toggleState": toggleSwitch})
          });
      } else if (request.getSwitch) {
          sendResponse({"finished": true, "toggleState": toggleSwitch});
      }
  });

  // get selection
  document.addEventListener("mouseup", handleMouseUp)

})
