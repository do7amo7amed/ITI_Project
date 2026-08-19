const dns = require('dns');

dns.setServers(['192.168.1.1']);

require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/services/dbConfig');

connectDB();

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});