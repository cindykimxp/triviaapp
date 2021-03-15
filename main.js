// route all api requests to api.js
let express = require('express')
let app = express()
let session = require('express-session')
let api_route = require('./api/api')
// express session default uses memory rather than disk, so need to provide it an efficient store, like Mongo or SQL 
app.use(session({
    secret : 'NYU_ACM',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        maxAge : 100 * 60 * 60 * 24
     }
}))
app.use(express.json())
app.use('/api', api_route)
//with express router
//serve webpages for frontend here
