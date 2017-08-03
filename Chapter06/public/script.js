/*
We put the code for fetching tmeperature in its own function
*/
const fetchTemperature = () => {
  fetch('/temperature')
    .then(results => {
      return results.text()
    })
    .then(text => {
      const temperatureDisplay = document.getElementById('temperature-display')
      temperatureDisplay.innerHTML = text
    })
}

/*
Make a similar function to fetch humidity
*/
const fetchHumidity = () => {
  fetch('/humidity')
    .then(results => {
      return results.text()
    })
    .then(text => {
      const temperatureDisplay = document.getElementById('humidity-display')
      temperatureDisplay.innerHTML = text
    })
}

/*
Call the above defined functions at regular intervals
*/
setInterval(() => {
  fetchTemperature()
  fetchHumidity()
}, 2000)
