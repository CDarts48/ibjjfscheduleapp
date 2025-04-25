const express = require('express');
const { getAllEastonCompetitors } = require('./matches.js'); // replace with the path to your script

const app = express();
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    const urls = [];
    const baseUrl = 'https://www.bjjcompsystem.com/tournaments/2360/tournament_days/3446?page=';

    for (let i = 1; i <= 8; i++) {
        urls.push(`${baseUrl}${i}`);
    }

    try {
        const teamInfo = await getAllEastonCompetitors(urls);
        res.render('index', { teamInfo }); // replace 'index' with the name of your EJS file
    } catch (error) {
        console.error(`Error in promise: ${error.message}`);
        res.status(500).send('An error occurred while fetching the team info.');
    }
});

app.listen(3000, '0.0.0.0', function() {
    console.log('Listening on port 3000');
});