const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db');

// Load config
dotenv.config({ path : './config/config.env' });

// passport config
require('./config/passport')(passport)
 
connectDB();

const app = express();
// Body parser
app.use(express.urlencoded({extended : false}));
app.use(express.json());

// Method override 
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
}))
 

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Handlebars Helpers
const { formatDate , stripTags , truncate , editIcon, select} = require('./helpers/hbs');

// Handlebars
app.engine(
    '.hbs', 
    exphbs({ 
        helpers : {
            formatDate,     
            stripTags,
            truncate,
            editIcon,
            select
        }, 
        defaultLayout : 'main',
         extname: '.hbs'
    }));
app.set('view engine', '.hbs');

// Sessions 
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store : new MongoStore({mongooseConnection : mongoose.connection})
  }))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Ser global var 
app.use(( req, res, next) => {
    res.locals.user = req.user || null 
    next()
})

// Static folder
app.use(express.static(path.join(__dirname, 'public')))
// if(process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, "client/build")));
// } 


// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'))

// React
// const serverRenderedContent = (req, res, next) => {
//     app.use(express.static(path.join(__dirname, "client/build")));
//     fs.readFile(path.resolve('./client/build/index.html'), 'utf8', (err, data) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).send('An error occurred')
//         }
//         return res.send(
//             data.replace(
//                 '<div id="root"></div>',
//                 `<div id="root">${ReactDOMServer.renderToString(Test)}</div>`
//             )
//         )
//     })
// };
// app.use('/Main',serverRenderedContent); 

app.get('/Main',(req,res) => {
    app.use(express.static(path.join(__dirname, "client/build")));
    res.sendFile(path.join(__dirname,"client/build","index.html"));
});

const PORT = process.env.PORT || 7010;

app.listen(
    PORT, 
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);