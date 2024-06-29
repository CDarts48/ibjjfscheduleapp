const express = require('express');
const { getAllCompetitors } = require('./Team.js'); // Import the function from team.js

const app = express();
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    const url = 'https://www.bjjcompsystem.com/tournaments/2492/tournament_days/by_club?club_id=664'; // Replace with your URL
    const teamInfo = await getAllCompetitors(url);
    res.render('index', { teamInfo }); // Render the index.ejs file with the teamInfo data
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));