const API_BASE = "https://d32bdp38hd.execute-api.eu-central-1.amazonaws.com/api"

const summarizeButton = document.getElementById("summarize");
summarizeButton.addEventListener("click", async (e) => {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    tabs.forEach(function (tab) {
      chrome.tabs.executeScript(tab.id, {file: 'inject.js'}, async function (pageInfo) {
        console.log(pageInfo);


        return resp;
      });
    });
  });
});