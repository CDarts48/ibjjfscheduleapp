const express = require('express');
const { getAllCompetitors } = require('./matches.js');

const app = express();
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    const urls = [];
    // This is the base URL it needs to be updated based on the tournament and tournament day
    const baseUrl = 'https://www.bjjcompsystem.com/tournaments/2734/tournament_days/3934';
    // if there are more than 8 pages, update the loop accordingly
    for (let i = 1; i <= 8; i++) {
        urls.push(`${baseUrl}?page=${i}`);
    }

    try {
        const teamInfo = await getAllCompetitors(urls, baseUrl);
        console.log(teamInfo);
        res.render('index', { teamInfo });
    } catch (error) {
        console.error(`Error in promise: ${error.message}`);
        res.status(500).send('An error occurred while fetching the team info.');
    }
});

app.listen(3000, '0.0.0.0', function() {
    console.log('Listening on port 3000');
});