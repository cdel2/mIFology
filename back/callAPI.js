'use strict'
const status = require('http-status')
const api = require('./api')

module.exports = (app, options) => {
    
    app.get('/url/:query', (req, res, next) => {
        console.log("query", req.params.query)
        //récupération des URLs
        api.getURLsFromGoogle(req.params.query).then(response => {
            //récupération des URIs correspondant à chaque URL
            //console.log(response)
            //var jsonArray = []
            var url
            for (var i = 0; i < response.items.length; i++) {
                url = response.items[i].formattedUrl;
                //jsonArray['uri' + i + 1] = api.getURIsFromWatson(url);
                api.getURIsFromWatson(url);
                //console.log(jsonArray['uri' + i + 1]);
            }
            res.status(200).send('ok')
        }).catch(next)
    })
}