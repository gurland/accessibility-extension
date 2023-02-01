const API_BASE = "http://23.88.117.114/api"

const summarizeButton = document.getElementById("summarize");
summarizeButton.addEventListener("click", async () => {
  console.log("ababa")
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    tabs.forEach(function (tab) {
      chrome.tabs.executeScript(tab.id, {file: 'inject.js'}, async function (pageInfo) {
        console.log(pageInfo);
        const response = await fetch(API_BASE + "/summaries/", {
          method: 'POST',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: JSON.stringify(
            pageInfo[0]
          )
        });
        let resp = await response.json();
        alert(JSON.stringify(resp));

        return resp;
      });
    });
  });
});