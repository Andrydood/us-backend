const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes');
const postgresMiddleware = require('./middleware/postgresMiddleware');
const loggerMiddleware = require('./middleware/loggerMiddleware');

const port = 4000;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(loggerMiddleware);
app.use(postgresMiddleware);

app.use(routes);

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`App listening on port ${port}!`));
