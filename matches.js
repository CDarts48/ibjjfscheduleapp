const axios = require('axios');
const cheerio = require('cheerio');

async function getAllEastonCompetitors(urls) {
    try {
        const allCompetitors = [];

        function convertTo24Hour(time) {
            const [mainTime, period] = time.split(' ');
            let [hours, minutes] = mainTime.split(':');

            if (period === 'PM' && hours !== '12') {
                hours = Number(hours) + 12;
            } else if (period === 'AM' && hours === '12') {
                hours = '00';
            }

            return `${hours}:${minutes}`;
        }

        await Promise.all(urls.map(async (url) => {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
            const matElements = $('.categories-grid__column.sticky-panel');
            const date = new Date();
            const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
            const dateText = date.toLocaleDateString('en-US', options);  // Updated date to current date

            matElements.each((i, matElement) => {
                const matNumber = $(matElement).find('.grid-column__header').text().trim();
                const competitors = $(matElement).next().find('.match-card__competitor');

                competitors.each((j, competitorDiv) => {
                    const competitorLink = $(competitorDiv).find('a');
                    const competitorName = $(competitorDiv).find('.match-card__competitor-name').text().trim();
                    const teamName = $(competitorDiv).find('.match-card__club-name').text().trim();
                    const competitorId = $(competitorDiv).attr('id').replace('competitor-', '');
                    const matchTime = $(competitorDiv).closest('li').find('.match-header__when').text().trim();
                    const timeWithoutFightNumber = matchTime.split(': FIGHT')[0];
                    
                    if (teamName === 'CheckMat' && competitorId && !allCompetitors.some(c => c.id === competitorId)) {
                        allCompetitors.push({
                            id: competitorId,
                            name: competitorName,
                            team: teamName,
                            mat: matNumber,
                            time: timeWithoutFightNumber,
                            date: dateText  // Added date
                        });
                    }
                });
            });
        }));

        allCompetitors.sort((a, b) => {
            const timeA = convertTo24Hour(a.time.split(': FIGHT')[0]);
            const timeB = convertTo24Hour(b.time.split(': FIGHT')[0]);

            const dateA = new Date(`1970-01-01T${timeA}`);
            const dateB = new Date(`1970-01-01T${timeB}`);

            return dateA - dateB;
        });

        for (let i = 0; i < allCompetitors.length - 1; i++) {
            if (allCompetitors[i].time === allCompetitors[i + 1].time) {
                allCompetitors[i].highlight = true;
                allCompetitors[i + 1].highlight = true;
            }
        }

        return allCompetitors;  // Return allCompetitors when all promises have resolved
    } catch (error) {
        console.error(`Error in getAllEastonCompetitors: ${error.message}`);
        return [];  // Return an empty array when an error occurs
    }
}


getAllEastonCompetitors(urls)
.then(competitors => {
    competitors.forEach(competitor => {
        console.log(`ID: ${competitor.id}, Name: ${competitor.name}, Team: ${competitor.team}, Mat: ${competitor.mat}, Time: ${competitor.time}, Date: ${competitor.date}`);
    });
})
.catch(error => console.error(`Error in promise: ${error.message}`));

module.exports = { getAllEastonCompetitors };
// this should help