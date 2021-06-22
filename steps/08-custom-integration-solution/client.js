const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid').v4;

const { GOOGLE_APPLICATION_CREDENTIALS } = process.env;
const [, , query, sessionId] = process.argv;
const { project_id } = require(GOOGLE_APPLICATION_CREDENTIALS);

const sessionClient = new dialogflow.SessionsClient({ keyFilename: GOOGLE_APPLICATION_CREDENTIALS });

// Running app
queryDialogflow(query, sessionId);

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} query The user say
 * @param {string} sessionId The session identifier
 */
async function queryDialogflow (query = 'Hello', sessionId) {
  // Creating a session if not given
  if (!sessionId) {
    sessionId = uuid();
    console.log('New session id:', sessionId);
  }
  const sessionPath = sessionClient.projectAgentSessionPath(
    project_id,
    sessionId
  );

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: query,
        // The language used by the client (en-US)
        languageCode: 'en-US'
      }
    }
  };

  // Send request
  const responses = await sessionClient.detectIntent(request);

  // Log result
  const result = responses[0].queryResult;
  console.log(`Query: ${result.queryText}`);
  result.intent ? console.log(`Intent: ${result.intent.displayName}`) : console.log('No intent matched.');

  if (!result?.fulfillmentMessages[0]?.text) { // Answer from Dialogflow
    console.log(`Response: ${result.fulfillmentText}`);
  } else { // Answer from Fulfillment
    result.fulfillmentMessages[0]?.text?.text?.forEach(msg => console.log(`Response: ${msg}`));
  }

}
