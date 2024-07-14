const express = require('express');
const { getAllCompetitors } = require('./Team.js'); // Import the function from team.js

const app = express();
app.set('view engine', 'ejs');

app.get('/team-info', async (req, res) => {
    const url = 'https://www.bjjcompsystem.com/tournaments/2451/tournament_days/by_club?club_id=664'; // Replace with your URL
    let teamInfo;
    try {
        teamInfo = await getAllCompetitors(url);
    } catch (error) {
        console.error(`Error getting competitors: ${error.message}`);
        teamInfo = []; // Set teamInfo to an empty array if an error occurs
    }
    res.json(teamInfo); // Send the teamInfo data as JSON
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));