const API_BASE = "http://23.88.117.114/api"

const summarizeButton = document.getElementById("summarize");
summarizeButton.addEventListener("click", () => {
  fetch('http://httpbin.org/ip').then(r => r.text()).then(result => {
    alert(result);
  });

  console.log("ababa");
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.executeScript(tabs[0].id, {file: 'inject.js'}, function (pageInfo) {
        fetch(API_BASE + "/summaries/", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(
            pageInfo[0]
          )
        }).then((response) => {
          alert(JSON.stringify(response.json()));
        });
      });
  });
});
