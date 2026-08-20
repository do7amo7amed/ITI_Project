//server.js
//starts the app, connects db

//import third-party library to read .env 
require('dotenv').config(); 

const app = require('./src/app');
const connectDB = require('./src/services/dbConfig');

//start mongoDB connection
connectDB(); 

//start http server listening for requests on this port
app.listen(process.env.PORT || 3000, () => { 
  console.log(`Server is running on port ${process.env.PORT || 3000}`); 
});
