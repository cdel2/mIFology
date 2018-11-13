'use strict'
const status = require('http-status')
const api = require('./api')

module.exports = (app, options) => {
    
    app.get('/url/:value', (req, res, next) => {
        console.log("query", req.params.value)
        //récupération des URLs
        api.GetAllInfo(req.params.value).then(response => {
            res.status(200).json(response)
            console.log("response", response)
        }).catch(next)
    })
}