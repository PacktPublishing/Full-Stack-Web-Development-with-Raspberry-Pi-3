const temperatureCanvasCtx = document
  .getElementById('temperature-chart')
  .getContext('2d')

const temperatureChartConfig = {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: 'rgba(255, 205, 210, 0.5)'
      }
    ]
  },
  options: {
    legend: {
      display: false
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            suggestedMin: 10,
            suggestedMax: 40
          }
        }
      ]
    }
  }
}
const temperatureChart = new Chart(temperatureCanvasCtx, temperatureChartConfig)

const humidityCanvasCtx = document
  .getElementById('humidity-chart')
  .getContext('2d')

const humidityChartConfig = {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: 'rgba(197, 202, 233, 0.5)'
      }
    ]
  },
  options: {
    legend: {
      display: false
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            suggestedMin: 30,
            suggestedMax: 90
          }
        }
      ]
    }
  }
}
const humidityChart = new Chart(humidityCanvasCtx, humidityChartConfig)

const pushData = (arr, value, maxLen) => {
  arr.push(value)
  if (arr.length > maxLen) {
    arr.shift()
  }
}

const humidityDisplay = document.getElementById('humidity-display')
const temperatureDisplay = document.getElementById('temperature-display')

const fetchTemperature = () => {
  fetch('/temperature')
    .then(results => {
      return results.json()
    })
    .then(data => {
      const now = new Date()
      const timeNow =
        now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
      pushData(temperatureChartConfig.data.labels, timeNow, 10)
      pushData(temperatureChartConfig.data.datasets[0].data, data.value, 10)
      temperatureChart.update()
      temperatureDisplay.innerHTML = '<strong>' + data.value + '</strong>'
    })
}

const fetchHumidity = () => {
  fetch('/humidity')
    .then(results => {
      return results.json()
    })
    .then(data => {
      const now = new Date()
      const timeNow =
        now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
      pushData(humidityChartConfig.data.labels, timeNow, 10)
      pushData(humidityChartConfig.data.datasets[0].data, data.value, 10)
      humidityChart.update()
      humidityDisplay.innerHTML = '<strong>' + data.value + '</strong>'
    })
}

const fetchTemperatureHistory = () => {
    /**
   * Call the APi we created
   */
  fetch('/temperature/history')
      .then(results => {
        return results.json()
      })
      .then(data => {
        data.forEach(reading => {
          /**
         * For each reading present in the "data" array,
         * convert the time to the ISO Z format accepted by the javascript Date object
         * Format the time and push data on to the chart, similar to the previous API calls
         */
          const time = new Date(reading.createdAt + 'Z')
          const formattedTime =
            time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
          pushData(temperatureChartConfig.data.labels, formattedTime, 10)
          pushData(
            temperatureChartConfig.data.datasets[0].data,
            reading.value,
            10
          )
        })

        /**
       * Finally, update the chart after all readings have been pushed
       */
        temperatureChart.update()
      })
}

const fetchHumidityHistory = () => {
  fetch('/humidity/history')
      .then(results => {
        return results.json()
      })
      .then(data => {
        data.forEach(reading => {
          const time = new Date(reading.createdAt + 'Z')
          const formattedTime =
            time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
          pushData(humidityChartConfig.data.labels, formattedTime, 10)
          pushData(humidityChartConfig.data.datasets[0].data, reading.value, 10)
        })
        humidityChart.update()
      })
}

/**
 * We first define a function to extract the parameters from the request query.
 * You do not need to be concerned too much with its implementation, although you could always study it as an excercise.
 */
function getParameterByName (name) {
  const url = window.location.href
  name = name.replace(/[\[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

const fetchTemperatureRange = () => {
  /**
   * The getParameterByName function is used to get the "start" and "end"
   * parameters from the query
   */
  const start = getParameterByName('start')
  const end = getParameterByName('end')

  /**
   * These parameters are then passed on to make AJAX requests to get the range of
   * readings from the server
   */
  fetch(`/temperature/range?start=${start}&end=${end}`)
    .then(results => {
      return results.json()
    })
    .then(data => {
      data.forEach(reading => {
        /**
         * These readings are pushed to the chart
         */
        const time = new Date(reading.createdAt + 'Z')
        const formattedTime =
          time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
        pushData(temperatureChartConfig.data.labels, formattedTime, 10)
        pushData(
          temperatureChartConfig.data.datasets[0].data,
          reading.value,
          10
        )
      })
      temperatureChart.update()
    })

  /**
   * We also use this information to fetch the average by calling the required
   * API, and updating the reading display with the result
   */
  fetch(`/temperature/average?start=${start}&end=${end}`)
    .then(results => {
      return results.json()
    })
    .then(data => {
      temperatureDisplay.innerHTML = '<strong>' + data.value + '</strong>'
    })
}

const fetchHumidityRange = () => {
  const start = getParameterByName('start')
  const end = getParameterByName('end')
  fetch(`/humidity/range?start=${start}&end=${end}`)
    .then(results => {
      return results.json()
    })
    .then(data => {
      data.forEach(reading => {
        const time = new Date(reading.createdAt + 'Z')
        const formattedTime =
          time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
        pushData(humidityChartConfig.data.labels, formattedTime, 10)
        pushData(humidityChartConfig.data.datasets[0].data, reading.value, 10)
      })
      humidityChart.update()
    })
  fetch(`/humidity/average?start=${start}&end=${end}`)
    .then(results => {
      return results.json()
    })
    .then(data => {
      humidityDisplay.innerHTML = '<strong>' + data.value + '</strong>'
    })
}

if (!getParameterByName('start') && !getParameterByName('end')) {
  /**
   * The fetchTemperature and fetchHumidity calls are now moved here
   * and are called only when the "start" and "end" parametes are not present in the query
   * In this case, we will be showing the live reading implementation
   */
  setInterval(() => {
    fetchTemperature()
    fetchHumidity()
  }, 2000)
  fetchHumidityHistory()
  fetchTemperatureHistory()
} else {
  /**
   * If we do have these parameters, we will only be showing the range of readings requested by calling the functions we defined in this section
   */
  fetchHumidityRange()
  fetchTemperatureRange()
}
