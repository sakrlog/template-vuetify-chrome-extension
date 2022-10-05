if (!document.getElementById("newsela-control-bar")) {
  var attr =
    " position: fixed;left: 0;bottom:0;width: 100%;height: 600px;text-align: center;background: lightblue;z-index: 999999;";
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
