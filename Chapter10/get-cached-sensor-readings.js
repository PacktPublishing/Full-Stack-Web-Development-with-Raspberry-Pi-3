const getSensorReadings = require('./get-sensor-readings')
const databaseOperations = require('./database-operations')
/**
 * Import the notify function from the notifier module
 */
const {notify} = require('./notifier')

const cache = {
  temperature: 0,
  humidity: 0
}

setInterval(() => {
  getSensorReadings((err, temperature, humidity) => {
    if (err) {
      return console.error(err)
    }
    databaseOperations.insertReading('temperature', temperature)
    databaseOperations.insertReading('humidity', humidity)

    /**
     * Check whether the incoming values from the sensor are the same as the previous values (that were stored in cache)
     * If they are different, notify all listers of the given type
     */
    if (cache.temperature !== temperature) {
      notify(temperature, 'temperature')
    }
    if (cache.humidity !== humidity) {
      notify(humidity, 'humidity')
    }
    cache.temperature = temperature
    cache.humidity = humidity
  })
}, 2000)

module.exports.getTemperature = () => cache.temperature
module.exports.getHumidity = () => cache.humidity
