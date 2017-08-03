var sensor = require('node-dht-sensor')

/*
We abstract away the functionality to read sensor information inside the getSensorReadings function.
This function is also asynchronous. It accepts a callback function as an argument.
*/
const getSensorReadings = (callback) => {
  sensor.read(11, 4, function (err, temperature, humidity) {
    if (!err) {
      /*
      If there is an error, call the callback function with the error as its first argument
      */
      return callback(err)
    }

    /*
    If everything went well, call the callback with "null" as the first argument to indicate thet there was no error.
    The second and third arguments would be the results (temperature and humidty respectively)
    */
    callback(null, temperature, humidity)
  })
}

module.exports = getSensorReadings
