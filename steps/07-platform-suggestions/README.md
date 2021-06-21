# To Do
Let's get out of dialogflow console to have a real platform. We will use Dialogflow Messenger, an easily integrated and customizable web element.

# Tips
As is, everything should work. But let's add a custom element that is very powerful: suggestion chips.
Template exemple is available in file `steps/00-ressources/dialogflow-messenger-suggestion.json`.

Lost connection? Debug using intent `_ping`.

Reminder of intent activation:
- Launch Ngrok and local serveur
- Activate fulfillment in Dialogflow interface Dialogflow
- Connect Dialogflow to local serveur
- Verify connexion

# Solution
Not much to explain, it's "just" following the template from documentation, that can be hard to get.   
As we can, we extract some information from request to deduce platform (Dialogflow Console or Messenger)
