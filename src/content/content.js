if (!document.getElementById("newsela-control-bar")) {
  var attr =
    " position: fixed;left: 0;bottom:0;width: 100%;height: 800px;text-align: center;background: black;border: 1px solid black;;z-index: 999999;";
  var source = chrome.runtime.getURL("content/main-newsela.html");
  var iframe = getOrCreateEl(
    "newsela-control-bar",
    "iframe",
    document.body,
    attr,
    source
  );
}

function getOrCreateEl(elId, elTag, parentEl, attributes, source) {
  let el = document.getElementById(elId);
  if (!el) {
    el = document.createElement(elTag || "div");
    el.id = elId;
    if(source) {
      el.src = source;
    }
    // el.setAttribute('allow', '');
    if (attributes) {
      el.setAttribute("style", attributes);
    }
    if (parentEl) {
      parentEl.appendChild(el);
    }
  }
  return el;
}

window.addEventListener("message", (event) => {
  if(event.data.function !== "change-newselas-iframe-size") {
    return
  }
  var iframe = document.getElementById("newsela-control-bar")
  iframe.style.height = event.data.size

  // …
}, false);