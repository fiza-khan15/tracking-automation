import eventSchema from "./tracking-plan.json" assert { type: "json" };

export function trackEvent(eventName, params = {}) {

  const schema = eventSchema[eventName];

  if (!schema) {
    console.error(`Invalid event: ${eventName}`);
    return;
  }

  for (const key in schema.required) {
    if (!(key in params)) {
      console.error(`Missing required parameter: ${key}`);
      return;
    }

    if (typeof params[key] !== schema.required[key]) {
      console.error(`Invalid type for ${key}`);
      return;
    }
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params
  });
}
