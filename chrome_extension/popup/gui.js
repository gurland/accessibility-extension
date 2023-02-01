"use strict";

const summarizeButton = document.getElementById("summarize");
summarizeButton.addEventListener("click", async () => {
  console.log("ababa")
  chrome.runtime.sendMessage({type: "summarize"});
  chrome.tabs.query({active: true, currentWindow: true}, function (result) {
    result.forEach(function (tab) {
      console.log(tab);
      chrome.tabs.executeScript(tab.id, {file: 'inject.js'}, function() {
        console.log('Successfully injected script into the page');
      });
    });
  });
});