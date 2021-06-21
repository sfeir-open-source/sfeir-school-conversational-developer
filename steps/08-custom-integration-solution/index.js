const simpleResponse = require('../00-ressources/simple-text-response.json');
const authors = require('../package.json').authors.join(',');
const wiki = require('wikijs').default;
const axios = require('axios').default;

const { AGENT_ID, CHAT_TITLE } = process.env;

// Backend server
// For simplicity sake is integrated but can (should) be another service
const http = require('http');
const html = `<!DOCTYPE html>
  <html lang='en'>
  <head>
    <meta charset='UTF-8' name='viewport' content='width-device-width, initial-scale=1'>
    <title>Dialogflow messenger demo</title>
  </head>
  <body>

    <script src='https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1'></script>
    <df-messenger
      intent='WELCOME'
      chat-title='${CHAT_TITLE}'
      agent-id='${AGENT_ID}'
      language-code='en',
      expand='true'
    ></df-messenger>
  </body>
  </html>
`;
const requestListener = function(req, res) {
  res.writeHead(200);
  res.end(html);
};
const server = http.createServer(requestListener)
  .listen(3000);
console.log('Server backend listening on port 3000');
// End Backend server

// Fulfillment
const BOT_AGE = process.env.BOT_AGE || new Date(2020, 10, 27);

exports.myDialogflowFulfillment = async (req, res) => {
  // console.log('My request body:', JSON.stringify(req.body, null, 2));
  const intentName = req.body.queryResult.intent.displayName;

  let answer;
  switch (intentName) {
    case '_WelcomeIntent':
      answer = {
        'fulfillmentMessages': [
          {
            'payload': {
              'payload': {
                'richContent': [
                  [
                    {
                      'type': 'image',
                      'accessibilityText': 'Dialogflow across platforms'
                    },
                    {
                      'subtitle': 'Build natural and rich conversational experiences',
                      'type': 'info',
                      'actionLink': 'https://cloud.google.com/dialogflow/docs',
                      'title': 'Dialogflow'
                    },
                    {
                      'options': [
                        {
                          'link': 'https://cloud.google.com/dialogflow/case-studies',
                          'text': 'Case Studies'
                        },
                        {
                          'text': 'Docs',
                          'link': 'https://cloud.google.com/dialogflow/docs'
                        }
                      ],
                      'type': 'chips'
                    }
                  ]
                ]
              }
            }
          },
          {
            'payload': {
              'richContent': [
                [
                  {
                    'type': 'image',
                    'rawUrl': 'https://example.com/images/logo.png',
                    'accessibilityText': 'Dialogflow across platforms'
                  },
                  {
                    'subtitle': 'Build natural and rich conversational experiences',
                    'title': 'Dialogflow',
                    'actionLink': 'https://cloud.google.com/dialogflow/docs',
                    'type': 'info'
                  },
                  {
                    'options': [
                      {
                        'link': 'https://cloud.google.com/dialogflow/case-studies',
                        'text': 'Case Studies'
                      },
                      {
                        'text': 'Docs',
                        'link': 'https://cloud.google.com/dialogflow/docs'
                      }
                    ],
                    'type': 'chips'
                  }
                ]
              ]
            }
          }, { 'text': { 'text': ['Hello! My name is Zytha. I can help you to know more about beer.', 'What do you want to discover today?'] } }],
        'fulfillmentMessages': []

        /*
        'richContent': [
          [
            {
              'type': 'chips',
              'options': [
                {
                  'text': 'Chip 1'
                },
                {
                  'text': 'Chip 2'
                }
              ]
            }
          ]
        ]
         */


        /*
        'richContent': [
          [
            {
              'type': 'chips',
              'options': [
                {
                  'text': 'Can you define a word?',
                  'image': {
                    'src': {
                      'rawUrl': 'https://example.com/images/logo.png'
                    }
                  }
                },
                {
                  'text': 'I am looking for a beer',
                  'image': {
                    'src': {
                      'rawUrl': 'https://icons-for-free.com/download-icon-beer-131994967629447645_32.png'
                    }
                  }
                }
              ]
            }
          ]
        ]*/
      };
      answer = {
        'fulfillmentMessages': [
          {
            'card': {
              'title': 'card title',
              'subtitle': 'card text',
              'imageUri': 'https://example.com/images/example.png',
              'buttons': [
                {
                  'text': 'button text',
                  'postback': 'https://example.com/path/for/end-user/to/follow'
                }
              ]
            }
          }
        ]
      };

      break;
    case 'LookingForABeer':
      const beerName = req.body.queryResult.parameters.beerName;
      const [, projectId, , , , , sessionId] = req.body.session.split('/');
      const beerAnswer = [];
      const outputContexts = [];
      const apiResult = await fetchBeerFromApi(beerName);
      if (!beerName) {
        console.info('Looking For a beer intent without a beer name');
        beerAnswer.push('What\'s the name of the beer you want more information about?');
      } else if (apiResult.data.nhits < 1) {
        console.info('Looking For a beer intent without results');
        beerAnswer.push('Sorry I don\'t know this beer. Can you tell me more about it?');
        outputContexts.push({
          name: `projects/${projectId}/agent/sessions/${sessionId}/contexts/${'newBeer'}`,
          lifespanCount: 3,
          parameters: { beerName }
        });
      } else {
        const { name, country, name_breweries } = apiResult.data.records[0].fields;
        beerAnswer.push(`Yes I know ${name}, it's a beer from ${country} made by ${name_breweries}.`);
        beerAnswer.push('What else can I do for you?');
      }
      answer = { 'fulfillmentMessages': [{ 'text': { 'text': beerAnswer } }], outputContexts };
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
  console.log('My answer:', JSON.stringify(answer, null, 2));
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
