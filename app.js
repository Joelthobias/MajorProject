const express = require("express");
const morgan = require('morgan');
const app = express();
const path = require('path');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser')
const Handlebars = require('handlebars')
const fileUpload = require('express-fileupload');
const AppError = require('./utils/appError');
const cors = require('cors');
// const globalErrorHandler = require('./controllers/errorController');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// Security - HTTPS header
app.use(helmet());
app.use(helmet());

app.use((req, res, next) => {
    res.removeHeader("Cross-Origin-Embedder-Policy");
    next();
});
const mainRouter=require('./routes/index');
app.use(fileUpload());
app.use(cors({ origin: 'http://localhost:3000' }));

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Logging Routes
app.use(morgan('dev'));

// Body Parser, reading data from body into req.body
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))

// Data sanitation against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use('/', mainRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${
        req.originalUrl
    } on the current server!`, 404));
});

// app.use(globalErrorHandler);

module.exports = app;