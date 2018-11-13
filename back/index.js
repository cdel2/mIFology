'use strict'
const server = require('./server/server')

console.log('=======================')
console.log('--- URL Service ---')
console.log('=======================')

async function startServer() {
    server.start({
        port: 3000
    }).then(app => {
        console.log(`Server started succesfully, running on port 3000. ✅`)
        app.on('close', () => {
          rep.disconnect()
        })
    })
}

startServer();