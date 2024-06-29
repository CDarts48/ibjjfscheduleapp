const axios = require('axios');
const cheerio = require('cheerio');

async function getAllCompetitors(url) {
  try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const matchCards = $('li.mach--weighted, li.match--assigned, li.match--created');
            const competitors = [];

            matchCards.each((i, matchCard) => {
              const matNumber = $(matchCard).find('.search-match-header__where').text().trim();
              const matchTime = $(matchCard).find('.search-match-header__when').text().trim();
          
              $(matchCard).find('.match-card__competitor').first().each((j, competitorDiv) => {
                  const competitorName = $(competitorDiv).find('.match-card__competitor-name').text().trim();
                  const teamName = $(competitorDiv).find('.match-card__club-name').text().trim();
                  const competitorId = $(competitorDiv).attr('id');
                  if (teamName === 'CheckMat' && !competitors.some(c => c.id === competitorId)) {
                    competitors.push({ id: competitorId, name: competitorName, team: teamName, mat: matNumber, time: matchTime });
                }
              });
            });
    
    return competitors;
    
  } catch (error) {
      console.error(`Error in getAllCompetitors: ${error.message}`);
  }
}

getAllCompetitors('https://www.bjjcompsystem.com/tournaments/2492/tournament_days/by_club?club_id=664')
  .then(competitors => console.log(competitors))
  .catch(error => console.error(`Error in promise: ${error.message}`));

  module.exports = { getAllCompetitors };