const authors = require('../package.json').authors.join(',');

exports.myDialogflowFulfillment = async (req, res) => {
  console.log('My request body:', JSON.stringify(req.body, null, 2));

  if ('_YourMaker' === req.body.queryResult.intent.displayName) {
    const text = `This demonstration fulfillment has been made with love by ${authors}`;
    const answer = {
      "fulfillmentMessages": [
        {
          "text": {
            "text": [
              text
            ]
          }
        }
      ]
    };

    res.send(answer);
  }
};
