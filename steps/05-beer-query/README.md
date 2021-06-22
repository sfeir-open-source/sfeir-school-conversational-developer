# To Do
After all this setup we can finally work on the use case for Agent Z: beers !   
The goal for this exercice is to get detail about a beer the user ask, to be precise the country and brewer of the beer.   
Target intent is `LookingForABeer` and this time, we are going to activate slot filling, so that the fulfillment give the question to ask when the parameter is empty.

# Tips

An open API is available for us to get data from: [Open Beer Database](https://data.opendatasoft.com/explore/dataset/open-beer-database%40public/table/?disjunctive.style_name&disjunctive.cat_name&disjunctive.name_breweries&disjunctive.country)   
[Axios](https://www.npmjs.com/package/axios) is available as a http client.

Lost connection? Debug using intent `_ping`.

Reminder of intent activation:
- Launch Ngrok and local serveur
- Activate fulfillment in Dialogflow interface Dialogflow
- Connect Dialogflow to local serveur
- Verify connexion
