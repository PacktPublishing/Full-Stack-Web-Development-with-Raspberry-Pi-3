const getSensorReadings = require('./get-sensor-readings')

/*
Instantiate the cache. In this case its a simple variable stored in local memory
*/
const cache = {
  temperature: 0,
  humidity: 0
}

/*
Run a function to get the sensor readings every 2 seconds (the same sampling rate as our sensor)
*/
setInterval(() => {
  getSensorReadings((err, temperature, humidity) => {
    if (err) {
      return console.error(err)
    }
    /*
    Set the values of the cache on receiving new readings
    */
    cache.temperature = temperature
    cache.humidity = humidity
  })
}, 2000)

/*
The functions that we expose only return the cached values, and don't make a call to the sensor interface everytime
*/
module.exports.getTemperature = () => cache.temperature
module.exports.getHumidity = () => cache.humidity
