global.browser = require('webextension-polyfill')
const $ = require("jquery")


chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if(request.cmd == "read_main_html") {
        $.ajax({
            url: chrome.extension.getURL("content/main-newsela.html"),
            dataType: "html",
            success: sendResponse
        });
    }
})

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if(request.cmd == "read_main_javascript") {
        $.ajax({
            url: chrome.extension.getURL("content/main-newsela.js"),
            dataType: "html",
            success: sendResponse
        });
    }
})