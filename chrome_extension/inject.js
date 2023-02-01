const API_BASE = "http://23.88.117.114/api"

const escapeHtml = (unsafeHTML) => {
    return unsafeHTML.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

async function sendToSummarize() {
  document.body.style.backgroundColor = 'red';
  const html = escapeHtml(document.documentElement.outerHTML);
  const url = window.location.href;


  // Default options are marked with *
  const response = await fetch(API_BASE+"/summaries", {
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
      {"url": url, "html": html}
    )
  });

  return await response.json();
}

sendToSummarize();
