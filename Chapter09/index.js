const express = require('express')
const path = require('path')
const app = express()
const getCachedSensorReadings = require('./get-cached-sensor-readings')
const databaseOperations = require('./database-operations')

app.use('/public', express.static(path.join(__dirname, 'public')))

app.get('/temperature', function (req, res) {
  res.json({
    value: getCachedSensorReadings.getTemperature().toFixed(1)
  })
})

app.get('/temperature/history', function (req, res) {
  databaseOperations.fetchLatestReadings('temperature', 10, (err, results) => {
    if (err) {
      /**
       * If any error occured, send a 500 status to the frontend and log it
       */
      console.error(err)
      return res.status(500).end()
    }
    /**
     * Return the reverse of the results obtained from the database.
     */
    res.json(results.reverse())
  })
})

app.get('/temperature/range', function (req, res) {
  /**
   * Here, the "start" and "end" datetimes for the range of readings are
   * expected to be received through the query parameters. This is spllied as part
   * of the URL request
   */
  const {start, end} = req.query

  /**
   * The "fetchReadingsBetweenTime" method is called, which returns an array of results, which we return as JSON to the client side
   */
  databaseOperations.fetchReadingsBetweenTime('temperature', start, end, (err, results) => {
    if (err) {
      console.error(err)
      return res.status(500).end()
    }
    res.json(results)
  })
})

app.get('/temperature/average', function (req, res) {
  const {start, end} = req.query
  databaseOperations.getAverageOfReadingsBetweenTime('temperature', start, end, (err, results) => {
    if (err) {
      console.error(err)
      return res.status(500).end()
    }
    /**
     * This is similar to the earlier API, except that we just return a singular value.
     * The signature is therefore more reminisent of the "/temperature" API
     */
    res.json({
      value: results['avg(value)'].toFixed(1)
    })
  })
})

app.get('/humidity/history', function (req, res) {
  databaseOperations.fetchLatestReadings('humidity', 10, (err, results) => {
    if (err) {
      console.error(err)
      return res.status(500).end()
    }
    res.json(results.reverse())
  })
})

app.get('/humidity/range', function (req, res) {
  const {start, end} = req.query
  databaseOperations.fetchReadingsBetweenTime('humidity', start, end, (err, results) => {
    if (err) {
      console.error(err)
      return res.status(500).end()
    }
    res.json(results)
  })
})

app.get('/humidity/average', function (req, res) {
  const {start, end} = req.query
  databaseOperations.getAverageOfReadingsBetweenTime('humidity', start, end, (err, results) => {
    if (err) {
      console.error(err)
      return res.status(500).end()
    }
    res.json({
      value: results['avg(value)'].toFixed(1)
    })
  })
})

app.get('/humidity', function (req, res) {
  res.json({
    value: getCachedSensorReadings.getHumidity().toFixed(1)
  })
})

app.listen(3000, function () {
  console.log('Server listening on port 3000')
})
