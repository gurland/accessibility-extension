// Script which is being injecting into target page
// In order to obtain needed document data and send to background.js

;(function() {
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

  chrome.runtime.sendMessage({type: "summarize", "pageInfo": getPageInfo()});
})();
