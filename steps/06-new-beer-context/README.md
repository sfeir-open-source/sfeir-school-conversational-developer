# To Do
With this exercice we will continue to add some "intelligence".
If we don't have information on the beer the user ask, we will ask him to give us details.
For that we will dynamically generate a context newBeer to allow this flow.

# Tips

Template for a context is available in folder `steps/00-ressources`.
In the context name, don't forget to replace `project-id`, `session-id` and `param-name` with your case value! All information are in Dialogflow's request.
Another format is also available for context name, but let's use the simplest one for now.

Lost connection? Debug using intent `_ping`.

Reminder of intent activation:
- Launch Ngrok and local serveur
- Activate fulfillment in Dialogflow interface Dialogflow
- Connect Dialogflow to local serveur
- Verify connexion
