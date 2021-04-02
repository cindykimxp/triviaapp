// route all api requests to api.js
let express = require('express');
let app = express();
let cors = require('cors');
let env_result = require('dotenv').config();
let session = require('express-session');
let PgSession = require('connect-pg-simple')(session);
let api_route = require('./api/api.js');
let database = require('./database/database.js');
// express session default uses memory rather than disk, so need to provide it an efficient store, like Mongo or SQL 
// start new session
// creates a new session ID
app.use(cors())
app.use(session({
    store : new PgSession({
        pool : database.pool
    }),
    secret : process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        maxAge : 100 * 60 * 60 * 24
    }
}))
app.use(express.json())
app.use('/api', api_route)
app.listen(3000, ()=> {
    console.log('listening on port 3000')
})
//with express router
//serve webpages for frontend here
