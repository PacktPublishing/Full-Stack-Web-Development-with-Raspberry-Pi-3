## $5 Tech Unlocked 2021!
[Buy and download this Book for only $5 on PacktPub.com](https://www.packtpub.com/product/full-stack-web-development-with-raspberry-pi-3/9781788295895)
-----
*If you have read this book, please leave a review on [Amazon.com](https://www.amazon.com/gp/product/1788295897).     Potential readers can then use your unbiased opinion to help them make purchase decisions. Thank you. The $5 campaign         runs from __December 15th 2020__ to __January 13th 2021.__*

# Full Stack Web development with Raspberry Pi 3
This is the code repository for [Full Stack Web development with Raspberry Pi 3](https://www.packtpub.com/hardware-and-creative/full-stack-web-development-raspberry-pi-3?utm_source=github&utm_medium=repository&utm_campaign=9781788295895), published by [Packt](https://www.packtpub.com/?utm_source=github). It contains all the supporting project files necessary to work through the book from start to finish.
## About the Book
Modern web technology and portable computing together have enabled huge advances in the Internet of Things (IoT) space,as well as in areas such as machine learning and big data. The Raspberry Pi is a very popular portable computer for running full stack web applications. This book will empower you to master this rapidly evolving technology to develop complex web applications and interfaces.

This book starts by familiarizing you with the various components that make up the web development stack and that will integrate into your Raspberry Pi-powered web applications. It also introduces the Raspberry Pi computer and teach you how to get up and running with a brand new one. Next, this book introduces you to the different kinds of sensor you’ll use to make your applications; using these skills, you will be able to create full stack web applications and make them available to users via a web interface. Later, this book will also teach you how to build interactive web applications using JavaScript and HTML5 for the visual representation of sensor data. Finally, this book will teach you how to use a SQLite database to store and retrieve sensor data from multiple Raspberry Pi computers.


## Instructions and Navigation
All of the code is organized into folders. Each folder starts with a number followed by the application name. For example, Chapter03.



The code will look like the following:
```
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
```



## Related Products
* [Build Supercomputers with Raspberry Pi 3](https://www.packtpub.com/hardware-and-creative/build-supercomputers-raspberry-pi-3?utm_source=github&utm_medium=repository&utm_campaign=9781787282582)

* [Full Stack .NET Web Development [Video]](https://www.packtpub.com/web-development/full-stack-net-web-development-video?utm_source=github&utm_medium=repository&utm_campaign=9781788291514)

* [Getting Started with Raspberry Pi Zero](https://www.packtpub.com/hardware-and-creative/getting-started-raspberry-pi-zero?utm_source=github&utm_medium=repository&utm_campaign=9781786469465)

