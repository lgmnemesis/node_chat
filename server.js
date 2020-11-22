require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose.Promise = Promise;

const dbUrl = `${process.env.DB_URL}`;

const Message = mongoose.model('Message', {
  name: String,
  message: String
})

app.get('/messages', (req, res) => {
  Message.find({}, (error, messages) => {
    res.send(messages);
  })
});

app.get('/messages/:user', (req, res) => {
  const user = req.params.user;
  Message.find({name: user}, (error, messages) => {
    res.send(messages);
  })
});

app.post('/messages', async (req, res) => {
  const msg = req.body;
  if (!msg || !msg.name) return res.sendStatus(400);

  try {
    const message = new Message(msg);
    await message.save();
    io.emit('message', msg);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }

});

io.on('connection', (socket) => {
  console.log('connected');
})

mongoose.connect(dbUrl, {useUnifiedTopology: true, useNewUrlParser: true}, (error) => {
  if (error) {
    console.log('mongodb connection error:', error);
  }
})

const server = http.listen(process.env.SERVER_PORT || 3000, () => {
  console.log('Server is running on port', server.address().port);
});