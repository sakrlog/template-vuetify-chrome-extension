// global.browser = require('webextension-polyfill')
// import $ from "jquery";


// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     if(request.cmd == "read_main_html") {
//         $.ajax({
//             url: chrome.runtime.getURL("content/main-newsela.html"),
//             dataType: "html",
//             success: sendResponse
//         });
//     }
// })

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     if(request.cmd == "read_main_javascript") {
//         $.ajax({
//             url: chrome.runtime.getURL("content/main-newsela.js"),
//             dataType: "html",
//             success: sendResponse
//         });
//     }
// })