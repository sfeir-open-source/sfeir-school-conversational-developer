# To Do
Instead of defining everything word in code, let's use Wikipedia as encyclopedia.

# Tips
Wikijs manuel is available [here](https://www.npmjs.com/package/wikijs)
Dialogflow's recognised parameter is present in the request but be careful, it is NOT required for this intent.   
Definitions are present in `00-ressources/definitions.js`, but it does not contain all possible cases (on purpose).   

Lost connection? Debug using intent `_ping`.

Reminder of intent activation:
- Launch Ngrok and local serveur
- Activate fulfillment in Dialogflow interface Dialogflow
- Connect Dialogflow to local serveur
- Verify connexion

# Solution
With code:
1. Check if user asked for a word defined in Dialogflow's entities
2. If we have a wikipedia summary for this glossaryWord we send it, hopping it is working for our bot.
3. Otherwise, we send a default answer

Warning, we do not have a timout, which can be dangerous with Dialogflow's 5 sec timeout!
