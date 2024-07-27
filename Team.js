const puppeteer = require('puppeteer');
const { writeTeamInfoToSheet } = require('./App');

async function getAllCompetitors(url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    const competitors = await page.evaluate(() => {
      const matElements = Array.from(document.querySelectorAll('.grid-column__header'));
      const competitors = [];

      matElements.forEach((matElement) => {
        const matNumber = matElement.textContent.trim();
        const matchCards = Array.from(matElement.parentElement.querySelectorAll('li.match--weighted, li.match--assigned, li.match--created'));

        matchCards.forEach((matchCard) => {
          const matchTime = matchCard.querySelector('.search-match-header__when').textContent.trim();

          const competitorDivs = Array.from(matchCard.querySelectorAll('.match-card__competitor'));
          competitorDivs.forEach((competitorDiv) => {
            const competitorName = competitorDiv.querySelector('.match-card__competitor-name').textContent.trim();
            const teamName = competitorDiv.querySelector('.match-card__club-name').textContent.trim();
            const competitorId = competitorDiv.id.replace('competitor-', '');

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
      });

      return competitors;
    });

    const sheetData = competitors.map(c => [c.team, c.name, c.id, c.mat, c.time]);
    sheetData.unshift(['Team Name', 'Competitor Name', 'Competitor ID', 'Mat Number', 'Match Time']);

    await writeTeamInfoToSheet(sheetData)
      .then(() => console.log('Data successfully written to Google Sheet'))
      .catch(error => console.error(`Error writing to Google Sheet: ${error.message}`));

    await browser.close();

    return competitors;
  } catch (error) {
    console.error(`Error in getAllCompetitors: ${error.message}`);
  }
}

getAllCompetitors('https://www.bjjcompsystem.com/tournaments/2456/tournament_days/by_club?club_id=611')
  .then(competitors => console.log(competitors))
  .catch(error => console.error(`Error in promise: ${error.message}`));

module.exports = { getAllCompetitors };