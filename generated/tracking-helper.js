
window.dataLayer = window.dataLayer || [];

function trackEvent(eventName, params = {}) {
  window.dataLayer.push({
    event: eventName,
    ...params
  });
}
