Blood Donation Management System



Read and do every steps carefully ***


Installation instruction

Prerequisities
1. Install nodjs version v6.9.4
2. Install npm version 3.10.10
3. Install mongodb version v3.4.1
4. create database 'bloodbank'
5. create collection 'donors'
6. For safer side run below command in mongodb
`db.donors.insert({"fname":"test","lname":"t","contactNum":"0099 999 9999 999","email":"ttt@ttt.com","address":{"addr":"test","city":"test","state":"test","country":"test","pcode":"test"},"bloodGroup":"AB Positive","location":{"type":"Point","coordinates":[-104.94,49.01412]}}
)`
7. run index query in mongodb `db.donors.createIndex({ location: "2dsphere" })`


Download dependencies
1. Go to the project folder
2. run `npm install`

Check running application in local

1. Go to the project folder
2. run `npm start`


Run unit tests

1. Go to the project folder
2. run `npm test`


Build minimized version of application

1. Go to the project folder
2. run `npm run build`

Running application in minimized version

1. Go to the project folder
2. run `node server.js`


Note:
please create index in db before running project
