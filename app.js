require('dotenv').config()
let express = require('express');
let bodyParser = require('body-parser');
let compression = require('compression');
let helmet = require('helmet');
let session = require('express-session');
let flash = require('connect-flash');
let path = require('path');
let cors = require('cors');

//Getting all Routers
let apiRoute = require('./routes/apiRoute');
let adminRoute = require('./routes/adminRoute');
let userRoute = require('./routes/userRoute');
let indexRoute = require('./routes/indexRoute');
let app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, './public')));

app.use(compression());
app.use(helmet());
app.use(cors());
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret: 'karconnect'
}));
app.use(flash());

//Global Varibles
app.use((req, res, next) => {
    res.locals.success = req.flash('success_msg');
    res.locals.error = req.flash('error_msg');
    res.locals.info = req.flash('info_msg');
    res.locals.user = req.session.user || null;
    next();
  });


var http = require('http').Server(app);
var io = require('socket.io')(http);
//MiddleWare
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


//Using Routes
// app.use('/', indexRoute);
app.use('/admin', adminRoute);
app.use('/user', userRoute);
app.use('/api', apiRoute);

app.use('/', indexRoute);



io.on('connection', function(socket){
    console.log('a user connected');
  });
  

http.listen(process.env.SERVER_PORT || process.env.PORT, () => {
    console.log(`App is running at ${process.env.SERVER_PORT}`);
});



