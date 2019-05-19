const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const http = require('http')
const container = require('./container')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const validator = require('express-validator')
const cookieParser = require('cookie-parser')
const verifyToken = require('./middleware/verifytoken');
var PORT = process.env.PORT || 3000
container.resolve(function (users, db, movies, directors,index,config) {


    const app = SetupExpress();

    function SetupExpress() {

        const app = express()
        const server = http.createServer(app)
       
        server.listen(PORT, () => console.log('Listening on port 3000'))
        configureExpress(app)
        //Setup router

        const router = require('express-promise-router')()
        users.SetRouting(router)
        movies.SetRouting(router)
        directors.SetRouting(router)
        index.SetRouting(router,config)
        app.use(router)

    }



    function configureExpress(app) {
        app.use('/api',verifyToken)
        app.use(express.static('public'))
        app.set('view engine', 'ejs')
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({ extended: true }))

        app.use(validator());
        app.use(session({
            secret: 'thisisasecretkey',
            resave: true,
            saveUninitialized: true,
            stroe: new MongoStore({ mongooseConnection: mongoose.connection })
        }))
        app.use(flash())


    }

})