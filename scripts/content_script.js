
// https://stackoverflow.com/questions/3731328/on-text-highlight-event

var toggleSwitch = false;
var allVars = Object()

// looking for a variable to highlight
var onVariable = false;
var onDefinition = false;

// Thank you James Padolsey for solving this problem I spent 8 hours cracking!!

// // https://stackoverflow.com/questions/494035/how-do-you-use-a-variable-in-a-regular-expression
//
// function regExQuote(str) {
//   return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
// };
//
// // https://stackoverflow.com/questions/34559256/how-to-replace-all-occurrences-of-a-string-in-a-html-page-using-javascript
//
// function walkText(node, text) {
//
//   // var re = new RegExp(regExQuote(text), "g");
//   // node = node.replace(re, `<span class="check"> ${text} </span>`);
//   // document.body.innerHTML = node
//
//   if (node.nodeType == 3) {
//     var re = new RegExp(regExQuote(text), "g");
//     node.data = node.data.replace(re, `<span class="check"> ${text} </span>`);
//   }
//
//   // https://j11y.io/javascript/replacing-text-in-the-dom-solved/
//
//   if (node.nodeType == 1 && node.nodeName != "SCRIPT") {
//     for (var i = 0; i < node.childNodes.length; i++) {
//       walkText(node.childNodes[i], text);
//     }
//   }
//
// }

function saveVariable() {
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
        if (document.getElementById("magnify-button") !== null) {
          document.getElementById("magnify-button").remove()
        }
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
        addButton.setAttribute("style", "border-radius: 12px; margin-right: 4px; height: 20px; width: 20px; color: white; background-color: #9CBBF2; display: flex; align-items: center; justify-content: center; font-size: 12px; font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, Arial, sans-serif;")
        addButton.innerHTML = "+";

        // color change on hover
        addButton.addEventListener("mouseover", function() {
          addButton.style.backgroundColor = "#6391EF";
          addButton.style.cursor = "pointer";
        });
        addButton.addEventListener("mouseout", function() {
          addButton.style.backgroundColor = "#9CBBF2";
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
          deleteButton.innerHTML = "Cancel"

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
          submitButton.innerHTML = "Save"

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

          container.setAttribute("style", "display: flex; flex-direction: column; align-items: space-evenly; padding: 12px 16px; justify-content: center; text-align: left; border-radius: 4px; border: 3px solid #9CBBF2; background-color: white; font-size: 12px; font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, Arial, sans-serif; color: black; position: fixed; top: 4px; right: 4px; z-index: 24601")

          defInput.setAttribute("style", "width: 200px; resize: none; outline: none; box-shadow: none; border: none; border-bottom: 1px solid #9CBBF2; margin-left: 4px; padding-bottom: 2px; text-align: left; background-color: none; font-size: 10px;")

          defLine.setAttribute("style", "display: flex; align-items: center; flex-grow: 1")

          responseButtons.setAttribute("style", "display: flex; align-items: center; justify-content: space-evenly; margin-top: 4px")

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

          tooltipSpan.setAttribute("style", "display: block; position: fixed; overflow: hidden; background-color: rgba(156, 187, 242, 1); font-size: 10px; color: white; padding: 4px 8px; border-radius: 4px")

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
  });

  // get existing variables saved
  chrome.storage.sync.get('vars', function(resp) {
      if (resp.allVars) {
        allVars = resp.allVars
      } else {
        allVars = new Object()
      }
  });

  // get selection
  document.addEventListener("mouseup", handleMouseUp)

})
