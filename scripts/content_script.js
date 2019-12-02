// https://stackoverflow.com/questions/3731328/on-text-highlight-event

var toggleSwitch = false;
var allVars;
var onVariable = false;
var onDefinition = false;

function handleMouseUp(e) {
  if (toggleSwitch) {
    var t = document.getSelection ? document.getSelection().toString() :  document.selection.createRange().toString() ;

    var prevAddButton = document.getElementById("add-button");

    if (prevAddButton) {
      prevAddButton.addEventListener("click", function() {
        console.log("clicked")
        tempVar = t

        // https://stackoverflow.com/questions/52700090/how-to-create-multiple-elements-by-dom-in-vanilla-javascript
        let container = document.createElement("div");
        container.id = "var-container";

        let varLine = document.createElement("div");
        varLine.id = "var-line";

        let defLine = document.createElement("div");
        defLine.id = "def-line";

        let varLabel = document.createTextNode(`Variable: `);
        let varText = document.createTextNode(tempVar);

        let defLabel = document.createTextNode(`Definition: `);
        let defInput = document.createElement("textarea");
        defInput.id = "def-input";
        defInput.placeholder = `Highlight new text to autopopulate this field, or type here`

        varLine.appendChild(varLabel)
        varLine.appendChild(varText)
        container.appendChild(varLine)

        defLine.appendChild(defLabel)
        defLine.appendChild(defInput)
        container.appendChild(defLine)

        container.setAttribute("style", "display: flex; align-items: center; justify-content: center")

        container.style.top = (r.top - relative.top - 36)+'px'; //this will place ele below the selection
        container.style.right = -(r.right - relative.right + 9)+'px'; //this will align the right edges together

        console.log(container)
        document.body.appendChild(container)

        addButton.remove()

        // create display for variable
        // remove plus sign
        // option to delete variable
        // create highlight definition flow
        // create edit definition flow
        // save set to Chrome

        // chrome.storage.sync.set({"switch": toggleSwitch});
      })
    }

    // highlight is valid
    if (t && t.trim()) {

      if (prevAddButton) {
        document.getElementById("add-button").remove();
      }

      if (!onVariable && !onDefinition) {
        // https://stackoverflow.com/questions/1589721/get-selected-text-position-and-place-an-element-next-to-it
        var r = window.getSelection().getRangeAt(0).getBoundingClientRect();
        var relative = document.body.parentNode.getBoundingClientRect();

        // add button styling
        let addButton = document.createElement("div");
        addButton.setAttribute("id", "add-button")
        addButton.setAttribute("style", "border-radius: 12px; height: 20px; width: 20px; color: white; background-color: #9CBBF2; display: flex; align-items: center; justify-content: center")
        addButton.style.top = (r.top - relative.top - 28)+'px'; //this will place ele below the selection
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
