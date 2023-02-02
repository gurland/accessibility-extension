;(function() {
  const API_BASE = "https://d32bdp38hd.execute-api.eu-central-1.amazonaws.com/api"

  const escapeHtml = (unsafeHTML) => {
    return unsafeHTML.replaceAll('&', '&amp;')
      .replaceAll('\n', ' ')
  }

  const getPageInfo = () => {
    return {
      "html": escapeHtml(document.documentElement.outerHTML),
      "url": window.location.href
    }
  };

  alert("started");
  chrome.runtime.sendMessage({type: "summarize", "pageInfo": getPageInfo()});
})();
