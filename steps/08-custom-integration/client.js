const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid').v4;

const { GOOGLE_APPLICATION_CREDENTIALS } = process.env;
const { project_id } = require(GOOGLE_APPLICATION_CREDENTIALS);

const sessionClient = new dialogflow.SessionsClient({ keyFilename: GOOGLE_APPLICATION_CREDENTIALS });

queryDialogflow();

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function queryDialogflow (projectId) {
  // A unique identifier for the given session
  const sessionId = uuid();

  // Create a new session
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
        text: 'hello',
        // The language used by the client (en-US)
        languageCode: 'en-US'
      }
    }
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log('  No intent matched.');
  }
}
