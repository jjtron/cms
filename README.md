clone from github  

INSTALL FRONTEND  
go to frontend directory  
npm install  

COMPILE FRONTEND  
go to frontend directory  
gulp compile

INSTALL BACKEND  
go to backend directory  
npm install  

INSTALL REDIS SERVER AND REDIS CLI  
https://redis.io/download  

SET THE REDIS PASSWORD  
using redis cli...   
127.0.0.1:6379> CONFIG set requirepass 'def'  

START APP (IN BROWSERSYNC MODE)  
go to backend directory  
gulp  
go to frontend directory  
gulp  

it will go to http://localhost:3001 automatically  

START APP (IN NON-BROWSERSYNC MODE)  
go to backend directory  
gulp  
go to frontend directory  
gulp compile  

http://localhost:3000  

-----------------------------------------------------------------  
  
TO DISTRIBUTE JS FILES WITH AN SFX (SELF-EXECUTING) JS FILE:  
go to frontend directory  
copy index-sfx.html file to index.html  
npm run tsc  
node build.js  
go to backend directory  
gulp  
go to http://localhost:3000  




