const express = require('express');
const codeRouter = require('./routes/code.route');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');
const CodeController = require('./controllers/code.controller');


const app = express();
const PORT = 5000;

try {
    mongoose.connect('mongodb://127.0.0.1:27017/codeShareDB');
} catch (error) {
  console.log(error);
}

app.use(cors());

app.use(bodyParser.json());

app.use('/', codeRouter);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origins: ['http://localhost:3000/'],
    methods: ['GET', 'POST']
  }
});


io.on('connection', (socket => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
  });

  socket.on('join_room', (room) => {
    console.log('Joined to room: ====> ', room);
    socket.join(room);
  });

  socket.on('change_code', (data) => {
    //data: {newCode: string, codeID: string}
    CodeController.updateCode(data);
    socket.to(data.codeID).emit('recieve_code_changes', {newCode: data.newCode});
  });
}));

server.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}`);
});