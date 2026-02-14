import fs from "fs";
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const SHEET_ID = "1RHylbkb98MrWq6Tzb993t-H5jHLJ01c9cSM0WnTED3Q";
const RANGE = "Sheet1!A2:D";

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

  fs.writeFileSync(
    "tracking-plan.json",
    JSON.stringify(schema, null, 2)
  );

  console.log("Tracking schema generated.");
}

generateSchema();
