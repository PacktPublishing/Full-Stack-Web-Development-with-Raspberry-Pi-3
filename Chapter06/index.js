const express = require('express')
const path = require('path')
const app = express()
const getCachedSensorReadings = require('./get-cached-sensor-readings')

app.use('/public', express.static(path.join(__dirname, 'public')))

app.get('/temperature', function (req, res) {
  res.send('<strong>' + getCachedSensorReadings.getTemperature().toFixed(1) + '</strong>')
})

app.get('/humidity', function (req, res) {
  res.send('<strong>' + getCachedSensorReadings.getHumidity().toFixed(1) + '</strong>')
})

app.listen(3000, function () {
  console.log('Server listening on port 3000')
})
