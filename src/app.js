const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes');
const websockets = require('./websockets');
const postgresMiddleware = require('./middleware/postgresMiddleware');
const loggerMiddleware = require('./middleware/loggerMiddleware');

const port = 4000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(loggerMiddleware);
app.use(postgresMiddleware);
app.use(routes);

io.on('connection', websockets);

// eslint-disable-next-line no-console
server.listen(port, () => console.log(`App listening on port ${port}!`));
