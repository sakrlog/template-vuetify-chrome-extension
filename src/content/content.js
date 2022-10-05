import $ from "jquery";

console.log("entered content script");
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
  var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
  // var xls = `<!DOCTYPE html>
  // <html lang="pt-BR">
  // <head>
  //   <meta charset="UTF-8">
  //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //   <meta http-equiv="X-UA-Compatible" content="ie=edge">
  //   <title>Template</title>
  //   <link rel="stylesheet" href="content.css">
  //   <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">
  //   <link href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css" rel="stylesheet">
  //   <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Material+Icons">
  //   <link href="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css" rel="stylesheet">
  //   <style>
  //     html{
  //       width: 1200px;
  //       height: 600px;
  //     }
  //   </style>
  // </head>
  // <body>
  //   <div id="app">
      
  //   </div>
  // </body>
  // </html>`

  // chrome.runtime.sendMessage({ cmd: "read_main_html" }, function (html) {
  //   console.log("read_main_html", html)
  //   const headTag =  html.match(/<head[^>]*>[\s\S]*<\/head>/gi)
  //   const bodyTag =  html.match(/<body[^>]*>[\s\S]*<\/body>/gi)
  //   $(innerDoc.head).html(headTag[0]);
  //   $(innerDoc.body).html(bodyTag[0]);
  // });

  // chrome.runtime.sendMessage({ cmd: "read_main_javascript" }, function (js) {
  //   console.log("read_main_javascript", js)
  //   let jscript = innerDoc.createElement("script");
  //   jscript.innerHTML = js
  //   innerDoc.body.appendChild(jscript);
  // });
}

function getOrCreateEl(elId, elTag, parentEl, attributes, source) {
  let el = document.getElementById(elId);
  if (!el) {
    el = document.createElement(elTag || "div");
    el.id = elId;
    el.src = source;
    el.setAttribute('allow', '');
    if (attributes) {
      el.setAttribute("style", attributes);
    }
    if (parentEl) {
      parentEl.appendChild(el);
    }
  }
  return el;
}
