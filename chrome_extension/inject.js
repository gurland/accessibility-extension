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

  fetch(API_BASE + "/summaries", {
    method: 'POST',
    mode: 'no-cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(
      getPageInfo()
    )
  }).then((response) => {
    alert(JSON.stringify(response));
  })

  return getPageInfo();
})();
