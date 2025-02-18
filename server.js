const express = require('express');
const codeRouter = require('./routes/code.route');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');
const CodeController = require('./controllers/code.controller');
require('dotenv').config();


const app = express();
const PORT = 5000;

try {
    mongoose.connect(process.env.MONGODB_URL);
} catch (error) {
  console.log(error);
}

app.use(cors());

app.use(bodyParser.json());

app.use('/', codeRouter);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origins: ['http://localhost:3000/', 'https://codeshare-frontend-yinon.onrender.com/'],
    methods: ['GET', 'POST']
  }
});


io.on('connection', (socket => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
  });

  socket.on('join_room', (room) => {
    console.log('Join roon: ', room);
    socket.join(room);
  });

  socket.on('leave_room', (room) => {
    socket.leave(room);
  });

  socket.on('change_code', (data) => {
    //data: {newCode: string, codeID: string, lan: string}
    CodeController.updateCode(data);
    socket.to(data.codeID).emit('recieve_code_changes', {data});
  });
}));

server.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}`);
});