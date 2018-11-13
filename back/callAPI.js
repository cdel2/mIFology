'use strict'
const status = require('http-status')
const api = require('./api')

module.exports = (app, options) => {
    
    app.get('/general/:value', (req, res, next) => {
        console.log("query", req.params.value)
        api.getAllInfo(req.params.value).then(response => {
            res.status(200).json(response)
            console.log("response", response)
        }).catch(next)
    })

    app.get('/siblings/:value', (req, res, next) => {
        console.log("query", req.params.value)
        api.getSiblingsInfo(req.params.value).then(response => {
            res.status(200).json(response)
            console.log("response", response)
        }).catch(next)
    })
}