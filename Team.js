const axios = require('axios');
const cheerio = require('cheerio');
const { writeTeamInfoToSheet } = require('./App'); // Make sure to import this function

async function getAllCompetitors(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const matchCards = $('li.match--weighted, li.match--assigned, li.match--created');
    const competitors = [];

    console.log(`Found ${matchCards.length} match cards`);

    matchCards.each((i, matchCard) => {
      const matNumber = $(matchCard).find('.search-match-header__where').text().trim();
      const matchTime = $(matchCard).find('.search-match-header__when').text().trim();

      $(matchCard).find('.match-card__competitor').each((j, competitorDiv) => {
        const competitorLink = $(competitorDiv).find('a');
        const competitorName = $(competitorDiv).find('.match-card__competitor-name').text().trim();
        const teamName = $(competitorDiv).find('.match-card__club-name').text().trim();
        const competitorId = $(competitorDiv).attr('id').replace('competitor-', '');

        if (teamName === 'Easton BJJ' && competitorId && !competitors.some(c => c.id === competitorId)) {
          competitors.push({
            id: competitorId,
            name: competitorName,
            team: teamName,
            mat: matNumber,
            time: matchTime
          });
        }
      });
    });

    // Prepare data for Google Sheets
    const sheetData = competitors.map(c => [c.team, c.name, c.id, c.mat, c.time]);
    sheetData.unshift(['Team Name', 'Competitor Name', 'Competitor ID', 'Mat Number', 'Match Time']); // Add header row

    // Write data to Google Sheets
    await writeTeamInfoToSheet(sheetData)
      .then(() => console.log('Data successfully written to Google Sheet'))
      .catch(error => console.error(`Error writing to Google Sheet: ${error.message}`));

    return competitors;

  } catch (error) {
    console.error(`Error in getAllCompetitors: ${error.message}`);
  }
}

getAllCompetitors('https://www.bjjcompsystem.com/tournaments/2456/tournament_days/by_club?club_id=611')
  .then(competitors => console.log(competitors))
  .catch(error => console.error(`Error in promise: ${error.message}`));

module.exports = { getAllCompetitors };