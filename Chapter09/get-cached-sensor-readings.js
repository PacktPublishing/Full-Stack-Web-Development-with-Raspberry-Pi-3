const getSensorReadings = require('./get-sensor-readings')

/**
 * Import the database module that we created earlier
 */
const databaseOperations = require('./database-operations')

const cache = {
  temperature: 0,
  humidity: 0
}

setInterval(() => {
  getSensorReadings((err, temperature, humidity) => {
    if (err) {
      return console.error(err)
    }
    /**
     * In addition to storing the readings in our cache, we also store them in our database, using the methods that we exported from our module
     */
    databaseOperations.insertReading('temperature', temperature)
    databaseOperations.insertReading('humidity', humidity)
    cache.temperature = temperature
    cache.humidity = humidity
  })
}, 2000)

module.exports.getTemperature = () => cache.temperature
module.exports.getHumidity = () => cache.humidity
