var express = require('express')
var cors = require('cors')
var index = require('./src/routes/routes')

var app = express()

app.use(cors())

app.listen(3333, function (req, res, next) {
console.log('CORS-enabled web server listening on port 3333')
})

app.use('/', index);