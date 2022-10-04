import $ from "jquery";

console.log("entered content script");
if (!document.getElementById("newsela-control-bar")) {
  var attr =
    " position: fixed;left: 0;bottom:0;width: 100%;height: 600px;text-align: center;background: lightblue;z-index: 999999;";
  var iframe = getOrCreateEl(
    "newsela-control-bar",
    "iframe",
    document.body,
    attr
  );
  var innerDoc = iframe.contentDocument || iframe.contentWindow.document;

  chrome.extension.sendRequest({ cmd: "read_main_html" }, function (html) {
    console.log("Loaded html: ", html);
    $(innerDoc.body).html(html);
  });

  chrome.extension.sendRequest({ cmd: "read_main_javascript" }, function (js) {
    console.log("Loaded javascript: ", js);
    let jscript = innerDoc.createElement("script");
    jscript.innerHTML = js
    innerDoc.body.appendChild(jscript);
  });
}

function getOrCreateEl(elId, elTag, parentEl, attributes) {
  let el = document.getElementById(elId);
  if (!el) {
    el = document.createElement(elTag || "div");
    el.id = elId;
    if (attributes) {
      el.setAttribute("style", attributes);
    }
    if (parentEl) {
      parentEl.appendChild(el);
    }
  }
  return el;
}
