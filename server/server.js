import express from 'express';
import bodyParser from "body-parser";

import apiRouter from './apiRouter.js';

const app = express();
const port = process.env.PORT_SERVER || 3001;

// app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Express listening on port ${port}!`));
app.use(express.static('public'));
app.use(express.static('static'));
// app.use('/files', express.static('public')) // virtual path prefix

// Body Parser for incoming POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', apiRouter);