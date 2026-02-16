// import fs from "fs";
// import { google } from "googleapis";

// const auth = new google.auth.GoogleAuth({
//   credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
//   scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
// });

import fs from "fs";
import { google } from "googleapis";

const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const SHEET_ID = "1RHylbkb98MrWq6Tzb993t-H5jHLJ01c9cSM0WnTED3Q";
const RANGE = "Sheet1!A2:D1000";
const rows = response.data.values;
console.log("ROWS FROM SHEET:");
console.log(JSON.stringify(rows, null, 2));

async function generateSchema() {
  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: RANGE,
  });

  const rows = response.data.values;

  const schema = {};

  rows.forEach(([event, param, required, type]) => {
    if (!schema[event]) {
      schema[event] = { required: {}, optional: {} };
    }

    if (required === "TRUE") {
      schema[event].required[param] = type;
    } else {
      schema[event].optional[param] = type;
    }
  });

  // fs.writeFileSync(
  //   "tracking-plan.json",
  //   JSON.stringify(schema, null, 2)
  // );

  const helperCode = `
window.dataLayer = window.dataLayer || [];

function trackEvent(eventName, params = {}) {
  window.dataLayer.push({
    event: eventName,
    ...params
  });
}
`;

  fs.mkdirSync("generated", { recursive: true });

fs.writeFileSync(
  "generated/schema.json",
  JSON.stringify(schema, null, 2)
);

fs.writeFileSync(
  "generated/tracking-helper.js",
  helperCode
);

  console.log("Tracking schema generated.");
}

generateSchema();
