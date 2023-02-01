;(function() {

  const escapeHtml = (unsafeHTML) => {
    return unsafeHTML.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  }

  const getPageInfo = () => {
    return {
      "html": escapeHtml(document.documentElement.outerHTML),
      "url": window.location.href
    }
  };
  alert("started");
  return getPageInfo();
})();
