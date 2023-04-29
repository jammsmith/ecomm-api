const mongoose = require('mongoose')
const dotenv = require('dotenv')

module.exports = async () => {
  dotenv.config()

  const { MONGO_CONNECTION_URI, DATABASE_NAME } = process.env

  mongoose
    .connect(MONGO_CONNECTION_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((err) => console.log(err))

  mongoose.set('strictQuery', true)

  const { connection } = mongoose

  connection.on('error', (err) =>
    console.log('Failed to connect with Mongoose', err)
  )
  connection.once('open', () => console.log(`Connected with ${DATABASE_NAME}`))
}
