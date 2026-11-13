/* Preserved Google Ads destinations. See docs/tracking-baseline.json. */
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
window.gtag('js', new Date());
window.gtag('config', 'AW-10852613132');

window.gtag_report_conversion = function (url) {
  // A callback may never arrive when analytics is blocked. Navigate once either way.
  let navigated = false;
  const callback = function () {
    if (!navigated && typeof url !== 'undefined') {
      navigated = true;
      window.location.href = url;
    }
  };
  window.gtag('event', 'conversion', {
    send_to: 'AW-10852613132/HSdnCJDq5dQcEIz49rYo',
    value: 1.0,
    currency: 'MYR',
    event_callback: callback
  });
  if (typeof url !== 'undefined') window.setTimeout(callback, 1200);
  return false;
};

window.gtag_report_conversion_ws = function () {
  window.gtag('event', 'conversion', {
    send_to: 'AW-10852613132/Z6GjCJXF5dQcEIz49rYo',
    value: 1.0,
    currency: 'MYR',
    event_callback: function () {},
    event_timeout: 2000
  });
};

// One handler for all outbound controls; no inline or second tracking listener.
document.addEventListener('click', function (event) {
  const link = event.target.closest('a[data-conversion]');
  if (!link || event.defaultPrevented) return;
  if (link.dataset.conversion === 'whatsapp') window.gtag_report_conversion_ws();
  if (link.dataset.conversion === 'email') {
    // Modified clicks retain browser behavior and still record the outbound intent.
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      window.gtag_report_conversion();
    } else {
      event.preventDefault();
      window.gtag_report_conversion(link.href);
    }
  }
});
