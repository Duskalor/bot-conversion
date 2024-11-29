const { connect, connection } = require('mongoose');

const connectDB = async () => {
  return await connect(process.env.MONGO_URL);
};

const connectClose = async () => {
  return await connection.close();
};
module.exports = { connectDB, connectClose };
