const { User } = require('../models');
const mongooseConnection = require('../client.js');

mongooseConnection();

(async () => {
  try {
    await User.deleteMany();
    console.log('Data deletion successful.');
    process.exit(0);
  } catch (err) {
    console.error(`Data deletion failed: ${err}`);
    process.exit(0);
  }
})();
