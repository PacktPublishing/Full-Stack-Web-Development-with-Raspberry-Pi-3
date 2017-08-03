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

/**
 * Import the external dependencies required, for us this is:
 * 1. The native http module
 * 2. The socket.io module that we installed
 * 3. THe subscribe and unsibscribe functions from the notifier module
 */
const http = require('http')
const socketIo = require('socket.io')
const {subscribe, unsubscribe} = require('./notifier')

/**
 * Create a new HTTP server that wraps the "app" object that defined our server
 */
const httpServer = http.Server(app)

/**
 * Socket.io implements its own routes on top of the existing ones by wrapping our HTTP server
 */
const io = socketIo(httpServer)

io.on('connection', socket => {
  /**
   * This callback is called everytime a new client successfully makes a websocket connection with our server
   */
  console.log(`User connected [${socket.id}]`)

  /**
   * The event listeners are defined inside the callback function because we need to access the "socket" instance, to emit changes to the client
   * The "pushTemperature" and "pushHumidity" listeners are called on change of temperature and humidity respectively.
   */
  const pushTemperature = newTemperature => {
    socket.emit('new-temperature', {
      value: newTemperature
    })
  }

  const pushHumidity = newHumidity => {
    socket.emit('new-humidity', {
      value: newHumidity
    })
  }

  /**
   * Subscribe the listeners that we just defined to the "temperature" and "humidity" events
   */
  subscribe(pushTemperature, 'temperature')

  subscribe(pushHumidity, 'humidity')

  socket.on('disconnect', () => {
    /**
     * Finally, when the connection is closed, unsibscribe the listeners from their events
     */
    unsubscribe(pushTemperature, 'temperature')
    unsubscribe(pushHumidity, 'humidity')
  })
})

/**
 * The httpsServer.listen method is called. This exposes the routes we defined for the "app" instance as well
 */
httpServer.listen(3000, function () {
  console.log('Server listening on port 3000')
})

/**
 * The app.listen metdhod invocation from the previous version is removed, in place of the httpServer.listen method
 */
// app.listen(3000, function () {
//   console.log('Server listening on port 3000')
// })
