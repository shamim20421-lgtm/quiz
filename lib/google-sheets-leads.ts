import "server-only";

import { google } from "googleapis";

type GoogleSheetLead = {
  name: string;
  mobileNumber: string;
  transactionReference?: string;
};

function getBangladeshDateTime() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

function getPrivateKey() {
  return process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
}

export async function appendLeadToGoogleSheet(lead: GoogleSheetLead) {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = getPrivateKey();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!clientEmail || !privateKey || !spreadsheetId) {
    console.warn("Google Sheets lead logging skipped: missing server environment variables.");
    return;
  }

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append(
      {
        spreadsheetId,
        range: "Sheet1!A:F",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
          values: [[getBangladeshDateTime(), lead.name, lead.mobileNumber, lead.transactionReference ?? "", "Website", "New"]],
        },
      },
      { timeout: 2500 },
    );
  } catch (error) {
    console.warn("Google Sheets lead logging failed.", {
      error: error instanceof Error ? error.name : "UnknownError",
    });
  }
}
