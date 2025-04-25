const axios = require('axios');
const cheerio = require('cheerio');

function log(message, data = null) {
    console.log(message, data || '');
}

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

function extractCompetitorDetails($, competitorDiv, matNumber, hardCodedDate) {
    const competitorName = $(competitorDiv).find('.match-card__competitor-name').text().trim();
    const teamName = $(competitorDiv).find('.match-card__club-name').text().trim();
    const competitorId = $(competitorDiv).attr('id')?.replace('competitor-', '');
    const matchTime = $(competitorDiv).closest('li').find('.match-header__when').text().trim();
    const timeWithoutFightNumber = matchTime.split(': FIGHT')[0];

    return {
        id: competitorId,
        name: competitorName,
        team: teamName,
        mat: matNumber,
        time: timeWithoutFightNumber,
        date: hardCodedDate
    };
}

function sortCompetitorsByTime(competitors) {
    return competitors.sort((a, b) => {
        const timeA = convertTo24Hour(a.time);
        const timeB = convertTo24Hour(b.time);

        const dateA = new Date(`1970-01-01T${timeA}`);
        const dateB = new Date(`1970-01-01T${timeB}`);

        return dateA - dateB;
    });
}

function highlightCompetitors(competitors) {
    for (let i = 0; i < competitors.length - 1; i++) {
        if (competitors[i].time === competitors[i + 1].time) {
            competitors[i].highlight = true;
            competitors[i + 1].highlight = true;
        }
    }
}

async function getAllCompetitors(urls, baseUrl) {
    try {
        if (!baseUrl || typeof baseUrl !== 'string') {
            throw new Error('Invalid or missing baseUrl');
        }

        log('Received Base URL:', baseUrl);

        const allCompetitors = [];

        // Step 1: Fetch the base URL to extract the date
        log('Fetching Base URL for Date:', baseUrl);
        const baseResponse = await axios.get(baseUrl);

        const $base = cheerio.load(baseResponse.data);

        // Extract the date from the span with class "sidebar__date"
        const sidebarDateText = $base('.sidebar__date').text().trim();
        log('Extracted Sidebar Date Text:', sidebarDateText);

        // Parse the date (e.g., "Saturday, 04/26 (10 Mats)" -> "Sat, 04/26")
        const dateMatch = sidebarDateText.match(/(\w+), (\d{2}\/\d{2})/);
        const extractedDate = dateMatch ? dateMatch[0] : 'Unknown Date';
        log('Parsed Date:', extractedDate);

        if (extractedDate === 'Unknown Date') {
            throw new Error('Failed to extract date from base URL');
        }

        // Step 2: Process competitors for each URL
        await Promise.all(urls.map(async (url) => {
            try {
                log('Fetching URL:', url);
                const response = await axios.get(url);
                log('HTML Response Length:', response.data.length);

                const $ = cheerio.load(response.data);
                const matElements = $('.categories-grid__column.sticky-panel');
                log('Mat Elements Found:', matElements.length);

                matElements.each((i, matElement) => {
                    const matNumber = $(matElement).find('.grid-column__header').text().trim();
                    log('Mat Number:', matNumber);

                    const competitors = $(matElement).next().find('.match-card__competitor');
                    log('Competitors Found:', competitors.length);

                    competitors.each((j, competitorDiv) => {
                        const competitorDetails = extractCompetitorDetails($, competitorDiv, matNumber, extractedDate);

                        // Here is where you update the team name. What ever is entered here will the team that is rendered.
                        if (competitorDetails.team === 'Nova União' && competitorDetails.id && !allCompetitors.some(c => c.id === competitorDetails.id)) {
                            log('Competitor Details:', competitorDetails);
                            allCompetitors.push(competitorDetails);
                        }
                    });
                });
            } catch (error) {
                console.error(`Error fetching data from ${url}: ${error.message}`);
            }
        }));

        log('All Competitors Before Sorting:', allCompetitors);
        sortCompetitorsByTime(allCompetitors);
        log('All Competitors After Sorting:', allCompetitors);

        highlightCompetitors(allCompetitors);
        log('Final Competitors with Highlights:', allCompetitors);

        return allCompetitors;

    } catch (error) {
        console.error(`Error in getAllCompetitors: ${error.message}`);
        return [];
    }
}

module.exports = { getAllCompetitors };