# ImBored Server

Server for a status chat application.

This project consists in a sending status if you are bored in a room using Socket.io

In order to run this project first make sure npm is installed by running:

`npm -v`

it should return something like that:

`$> npm -v`  
`$> 6.12.0`


if not check the nodejs website: https://nodejs.org/en/
Once Node is installed and the repository is cloned cd into the it and install the dependencies:

`cd server`  
`npm install`

Also you'll need to check if mongodb is installed by running:
`mongod --version`

If mongodb isn't installed check the mongodb website: https://www.mongodb.com/

Once all the dependencies are installed you can run the server
in dev:

`npm run dev`

in prod:

`npm run start`

This project also have a linter that you can run using:

`npm run lint`
