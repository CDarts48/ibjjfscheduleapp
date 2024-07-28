const express = require('express');
const { getAllEastonCompetitors } = require('/Users/corey/Desktop/masterApp/matches.js'); // replace with the path to your script
const urls = require('./urls');

const app = express();
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    try {
        const teamInfo = await getAllEastonCompetitors(urls); // Pass urls here
        console.log(teamInfo); // Add this line
        res.render('index', { teamInfo }); // replace 'index' with the name of your EJS file
    } catch (error) {
        console.error(`Error in promise: ${error.message}`);
        res.status(500).send('An error occurred while fetching the team info.');
    }
});

app.listen(3000, '0.0.0.0', function() {
    console.log('Listening on port 3000');
});