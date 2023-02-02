const API_BASE = "http://23.88.117.114/api";

chrome.runtime.onMessage.addListener(async (message, sender, reply) => {
  if (message.type === "summarize") {
    const response = await fetch(API_BASE + "/summaries", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        message.pageInfo
      )
    });
    if (response.status === 200) {
      alert(JSON.stringify(await response.json()));
    }
  }
});
