if (!document.getElementById("newsela-control-bar")) {
  var attr =
    " position: fixed;left: 0;bottom:0;width: 100%;height: 50px;text-align: center;background: black;border: 1px solid black;;z-index: 999999;";
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
    if (source) {
      el.src = source;
    }
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
  console.log("new message:", event.data)
  if(event.data.function !== "change-newselas-iframe-size")
  return
  console.log("enetered the conetnet script from the other hand", event)
  var iframe = document.getElementById("newsela-control-bar")
  iframe.style.height = event.data.size

  // …
}, false);

window.addEventListener(
  "message",
  (event) => {
    if (event.data !== "getParentWindowDetails") {
      return;
    }

    let data = {
      message: "window_location_href",
      parent: {
        href: window.location.href,
        hostname: window.location.hostname,
        protocol: window.location.protocol
      }
    };
    iframe.contentWindow.postMessage(data, "*");
  },
  false
);
