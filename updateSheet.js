require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const { google } = require('googleapis');
const { getAllCompetitors } = require('./Team.js'); // Import the getAllCompetitors function
const app = express();

// Initialize the Sheets API
const sheets = google.sheets({ version: 'v4', auth: process.env.API_KEY });

app.get('/update-sheet', async (req, res) => {
    try {
        const url = 'https://www.bjjcompsystem.com/tournaments/2471/tournament_days/by_club?page=1&club_id=664';
        const competitors = await getAllCompetitors(url);
        console.log('Competitors:', competitors); // Log the competitors data

        // Format the competitors data for Google Sheets
        const values = competitors.map(competitor => [
            competitor.id,
            competitor.name,
            competitor.team,
            competitor.mat,
            competitor.time
        ]);

        // Append each competitor's data to a new row in the Google Sheet
        for (let value of values) {
            await sheets.spreadsheets.values.append({
                spreadsheetId: process.env.KeyFile, // Use the spreadsheet ID from the .env file
                range: 'MasterApp', // The name of the sheet to append to
                valueInputOption: 'USER_ENTERED',
                insertDataOption: 'INSERT_ROWS',
                resource: { values: [value] }
            });
        }

        res.json({ success: true, message: 'Sheet updated successfully' });
    } catch (error) {
        console.error(`Error updating Google Sheet: ${error.message}`);
        res.status(500).json({ success: false, message: 'An error occurred while updating the sheet' });
    }
});

app.listen(3000, () => console.log('Server is running on port 3000'));