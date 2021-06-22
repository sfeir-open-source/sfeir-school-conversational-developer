const simpleResponse = require('../00-ressources/simple-text-response.json');
const authors = require('../package.json').authors.join(',');
const BOT_AGE = process.env.BOT_AGE || new Date(2020, 10, 27);

exports.myDialogflowFulfillment = async (req, res) => {
  console.log('My request body:', JSON.stringify(req.body, null, 2));

  let answer;
  switch (req.body.queryResult.intent.displayName) {
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
