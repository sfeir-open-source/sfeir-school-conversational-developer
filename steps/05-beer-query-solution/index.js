const simpleResponse = require('../00-ressources/simple-text-response.json');
const authors = require('../package.json').authors.join(',');
const wiki = require('wikijs').default;
const axios = require('axios').default;

const BOT_AGE = process.env.BOT_AGE || new Date(2020, 10, 27);

exports.myDialogflowFulfillment = async (req, res) => {
  console.log('My request body:', JSON.stringify(req.body, null, 2));
  const intentName = req.body.queryResult.intent.displayName;

  let answer;
  switch (intentName) {
    case 'LookingForABeer':
      const beerName = req.body.queryResult.parameters.beerName;
      const beerAnswer = [];
      const apiResult = await fetchBeerFromApi(beerName);
      if (!beerName) {
        console.info('Looking For a beer intent without a beer name');
        beerAnswer.push('What\'s the name of the beer you want more information about?');
      } else if (apiResult.data.nhits < 1) {
        console.info('Looking For a beer intent without no results');
        beerAnswer.push('Sorry I don\'t know this beer. Can you tell me more about it?');
      } else {
        const { name, country, name_breweries } = apiResult.data.records[0].fields;
        beerAnswer.push(`Yes I know ${name}, it's a beer from ${country} made by ${name_breweries}.`);
        beerAnswer.push('What else can I do for you?');
      }
      answer = { 'fulfillmentMessages': [{ 'text': { 'text': beerAnswer } }] };
      break;

    case '_GlossaryDefinition':
      const glossaryWord = req.body.queryResult.parameters.glossaryWords;
      const glossaryAnswer = [];
      if (!glossaryWord) {
        console.info(`No glossary word found for intent ${intentName}`);
        glossaryAnswer.push('What do you want me to explain?');
      } else {
        const wikiSummary = await wiki()
          .page(glossaryWord)
          .then(page => page.summary())
          .catch(error => {
            console.warn('An error occurred while accessing Wikipedia');
            console.warn(error);
          });
        if (wikiSummary) {
          glossaryAnswer.push(wikiSummary);
          glossaryAnswer.push('Can I help you with something else?');
        } else {
          console.warn(`Unknown glossary word ${glossaryWord} for intent ${intentName}`);
          glossaryAnswer.push('Sorry I have no idea what you are talking about. Maybe I can help you with something else?');
        }
      }
      answer = { 'fulfillmentMessages': [{ 'text': { 'text': glossaryAnswer } }] };
      break;

    case '_YourAge':
      const age = Number((new Date().getTime() - BOT_AGE.getTime()) / 31536000000).toFixed(0);
      const warnText = 'You\'re quite bold to ask a lady her age.';
      const ageText = `But sure, I'm ${age} years old.`;
      const smartText = 'Quite smart for a human I dare to say.';
      answer = { 'fulfillmentMessages': [{ 'text': { 'text': [warnText, ageText, smartText] } }] };
      break;

    case '_YourMaker':
      const text = `This demonstration fulfillment has been made with love by ${authors}`;
      answer = { 'fulfillmentMessages': [{ 'text': { 'text': [text] } }] };
      break;

    case '_ping':
      answer = simpleResponse;
      break;

  }
  res.send(answer);
};

async function fetchBeerFromApi (beerName) {
  return axios({
    method: 'get',
    //    https://data.opendatasoft.com/api/records/1.0/search/
    //    ?dataset=open-beer-database%40public
    //    &q=heineken
    //    &facet=style_name&facet=cat_name&facet=name_breweries&facet=country
    url: 'https://data.opendatasoft.com/api/records/1.0/search/',
    responseType: 'json',
    params: {
      dataset: 'open-beer-database@public',
      q: `${beerName}`,
      facet: ['style_name', 'cat_name', 'name_breweries', 'country']
    }
  }, { timeout: 4000 }).catch(error => {
    console.error('Fail to request beer DB :' + error);
    return { data: { nhits: 0 } };
  });
}
