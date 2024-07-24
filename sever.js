// Loads enviromental variables
require('dotenv').config();

// Imports the required packages
const path = require('path')
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controller');
const helpers = require('./utils/helper');

// Creates an instance of the express application
const app = express();
const PORT = process.env.PORT || 3001;


// SOCKET STUFFF I HATE THIIIIISSSS I SHOULD PROBABLY FOCUS ON THE PROJECT BUT IM AN IDIOT
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST']
  }});


io.on('connection', (socket) => {
  console.log("A CONNECTION HAS BEEN MADE");

  socket.on('newMessage', (message) => {
    // Broadcast the new message to all connected clients
    io.emit('newMessage', { id: message.id, content: message.content });
});

  socket.on('disconnect', () => {
    console.log('A client has DISCONEECCTEEDDDD');
  })
})

server.listen(3000, () => {
  console.log('LISTENING ON PORT 3000 AAAAAA')
})


// Creates an instance of Handlebars engine
const hbs = exphbs.create({
  helpers,
  partialsDir: [path.join(__dirname, 'views', 'partials')]
});

// Requires the sequelize connection
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Configures the session
const sess = {
    secret: process.env.SECRET,
    cookie: {
      maxAge:  3600000,
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize
    })
};

// Sets handlebars as the view engine 
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Sets up session middleware
app.use(session(sess));

// Sets up middleware for parsing url and json encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sets up the routes
app.use(routes);

// Serves the static files in the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Sync Sequelize models with the database and start the server
sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});