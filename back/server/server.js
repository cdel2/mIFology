'use strict'
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const bodyParser = require('body-parser')
const callAPI = require('../callAPI')

const start = (options) => {
  return new Promise((resolve, reject) => {
    if (!options.port) {
      reject(new Error('The server must be started with an available port'))
    }
    // let's init a express app, and add some middlewares
    const app = express()
    app.use(morgan('dev'))
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(helmet())
    app.use(cors())
    app.use((err, req, res, next) => {
      reject(new Error('Something went wrong!, err:' + err))
      res.status(500).send('Something went wrong!')
    })
    
    // we add our API's to the express app
    callAPI(app, options)
    
    // finally we start the server, and return the newly created server 
    const server = app.listen(options.port, () => resolve(server))
  })
}

module.exports = { start } 