const simpleResponse = require('../00-ressources/simple-text-response.json');

exports.myDialogflowFulfillment = async (req, res) => {
  console.log('My request body:', JSON.stringify(req.body, null, 2));
  res.send(simpleResponse);
};
