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


// Initiates a server and the socket
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  // Allow from cross origin requests from http://localhost:3001 with the get and post methods only
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST']
  }});

// Event listener for when a connection is established
io.on('connection', (socket) => {
  console.log("A connection has been established");

  // Event listener for 'joinChat' events 
  socket.on('joinChat', ({ userId, targetUserId }) => {
    // Creates a room id joining the ids of the members of the chat
    const roomId = [userId, targetUserId].sort().join('_'); 
    // Join the especified room
    socket.join(roomId);
  });

  // Event listener for 'newMessage' events
  socket.on('newMessage', (message) => {
    // Gets the room id
    const roomId = [message.senderId, message.receiverId].sort().join('_'); 
    // Sends the new message to the target room
    io.to(roomId).emit('newMessage', { content: message.content, senderId: message.senderId });
  });

  // Event listener for when the client disconnects
  socket.on('disconnect', () => {
    console.log('A client has disconected');
  })
})

// Start the server and listen on port 3000
server.listen(3000, () => {
  console.log('LISTENING ON PORT 3000')
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