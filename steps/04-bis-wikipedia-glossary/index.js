const simpleResponse = require('../00-ressources/simple-text-response.json');
const authors = require('../package.json').authors.join(',');
const definitions = require('../00-ressources/definitions');

const BOT_AGE = process.env.BOT_AGE || new Date(2020, 10, 27);

exports.myDialogflowFulfillment = async (req, res) => {
  console.log('My request body:', JSON.stringify(req.body, null, 2));
  const intentName = req.body.queryResult.intent.displayName;

  let answer;
  switch (intentName) {
    case '_GlossaryDefinition':
      const glossaryWord = req.body.queryResult.parameters.glossaryWords;
      const glossaryAnswer = [];
      if (!glossaryWord) {
        console.info(`No glossary word found for intent ${intentName}`);
        glossaryAnswer.push('What do you want me to explain?');
      } else if (definitions.has(glossaryWord)) {
        console.warn(`Unknown glossary word ${glossaryWord} for intent ${intentName}`);
        glossaryAnswer.push(definitions.get(glossaryWord));
        glossaryAnswer.push("Can I help you with something else?");
      } else {
        glossaryAnswer.push('Sorry I don\'t know this word. Maybe I can help you with something else?');
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
