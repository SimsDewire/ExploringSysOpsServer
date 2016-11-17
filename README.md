# ExploringSysOpsServer  

This repository is a part of a school-project called Student Innovation Mid Sweden, or SIMS for short. What we, as the Dewire group,
will do for this project is to Explore the world of System Operators (Exploring SysOps) where the focus will be on how to improve
system surveillance. This is the server-side of the project.

**Installation**  
You will need to have NodeJS and MongoDB installed for the server to work.

Linux
To set up the server, you need to run the commands: _"npm install"_, _"mkdir -p data/db"_ and then _"npm start"_.  
This will start the server and initialize the mongoDB.  

Windows
Create an empty folder (where the database will reside), for example C:\data\db
Make sure that MongoDB is started by using command: _"mongod --port 27017 --dbpath C:\data\db"_ in a separate CMD window.
Then start the server by typing _"node app.js"_ in another window, when inside the ExploringSysOpsServer/ folder.
