# To Do
We don't like Dialogflow's integration, and we would like to make our own cli to query our bot.   
First you need a service account JSON key from a Google Cloud Platform service account that have Dialogflow client autorisation.     
Then, add this JSON key path to `steps/.env` file like `GOOGLE_APPLICATION_CREDENTIALS=<path>`.   
File `client.js` is a slightly modified [Dialogflow npm boilerplate](https://www.npmjs.com/package/@google-cloud/dialogflow) to use for this step.

# Tips

Use` npm run client` to run script.
A session is generated for each query.      
Response differ if it comes from Dialogflow or the fulfillment.   
`process.argv` to get script's arguments.


Lost connection? Debug using intent `_ping`.

Reminder of intent activation:
- Launch Ngrok and local serveur
- Activate fulfillment in Dialogflow interface Dialogflow
- Connect Dialogflow to local serveur
- Verify connexion

# Solution
We get script argument to allow reuse of the sessionId because contextes are bind to it and otherwise "lost".   
That are the way, we can get request result and print it to console with a little distinction if it came from Dialogflow or Fulfillment.
