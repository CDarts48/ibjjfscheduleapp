require('dotenv').config();
const { google } = require('googleapis');

async function writeTeamInfoToSheet(teamInfo) {
    const auth = new google.auth.JWT(
        process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        null,
        process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        ['https://www.googleapis.com/auth/spreadsheets']
    );

    const googleSheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = '1O-6AOE7mCit2ukYasLT4m7BfPmitKRZ7Y9vOUYgwcRw';
    const update = await googleSheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'MasterApp!A1', // Update with your sheet name and the range you want to write to
        valueInputOption: 'RAW',
        resource: {
            values: teamInfo
        }
    });

    return update.data; // This will return the response from the Google Sheets API
}
module.exports = { writeTeamInfoToSheet };