const express = require('express');
const { getAllEastonCompetitors } = require('/Users/corey/Desktop/masterApp/matches.js'); // replace with the path to your script

const app = express();
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    const urls = [
        'https://www.bjjcompsystem.com/tournaments/2456/tournament_days/3329',
        'https://www.bjjcompsystem.com/tournaments/2456/tournament_days/3329?page=2',
        'https://www.bjjcompsystem.com/tournaments/2456/tournament_days/3329?page=3'
    ];

    try {
        const teamInfo = await getAllEastonCompetitors(urls);
        res.render('index', { teamInfo }); // replace 'index' with the name of your EJS file
    } catch (error) {
        console.error(`Error in promise: ${error.message}`);
        res.status(500).send('An error occurred while fetching the team info.');
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));