# VerkiezingAPI
Project voor het vak dataprocessing

Deel 1,2 en 3 Casper van den Berg 4580125

In dit project staan 2 mappen met validatie schema's, 1 voor XML en 1 voor JSON 

# Docker
De backend maakt gebruik van een mongoDB database, deze zal in docker draaien.
Voer het commando `docker-compose up -d` uit in de Project map.
```
cd .\Project\
docker compose up -d
```

# Backend
De api kan gestart door in de backend folder een terminal te openen en hier npm install, npm run build en daarna npm run start uit te voeren.
```
cd .\backend\
npm install
npm run build
npm run start
```

# Frontend
en de frontend door npm start uit te voeren in de frontend folder. 
```
cd .\frontend\
npm run start
```

# Documentatie in Postman
De documentatie van de API is te zien in postman door het ElectionAPI.postman_collection.json te importeren.

# Commands to reinstall docker files in case it breaks
```
docker compose down
docker system prune -a
docker volume rm project_storedata
docker volume rm project_mongo-configdb
docker compose up -d
```
