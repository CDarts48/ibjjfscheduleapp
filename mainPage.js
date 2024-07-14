const express = require('express');
const { getAllCompetitors } = require('./Team.js');

const app = express();
app.set('view engine', 'ejs');

async function fetchTeamInfo() {
    const url = 'https://www.bjjcompsystem.com/tournaments/2451/tournament_days/by_club?club_id=664';
    try {
        return await getAllCompetitors(url);
    } catch (error) {
        console.error(`Error getting competitors: ${error.message}`);
        return []; // Return an empty array if an error occurs
    }
}

app.get('/', async (req, res) => {
    const teamInfo = await fetchTeamInfo();
    res.render('index', { teamInfo });
});

app.get('/team-info', async (req, res) => {
    const teamInfo = await fetchTeamInfo();
    res.json(teamInfo);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));