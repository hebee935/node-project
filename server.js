'use strict';

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';

import config from './config';
import { connection } from './db';
import logger from './lib/logger';
import { getPublicIP } from './lib/utils';

const app = express();

morgan.token('clientIP', (req, _res) => {
	return getPublicIP(req);
});

morgan.token('user', () => '');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride());
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan(':clientIP(:user) :url :status :method :res[content-length] - :response-time ms', {
    stream: logger.stream,
    skip: (req, _res) => req.originalUrl === '/heartbeat',
}));

runServer();

async function runServer() {
    await connection();

    const routing = require('./routing');
    routing.default(app);

    app.listen(config.port, () => {
        logger.info(`${config.env} server listening on ${config.port} port!!`);
    });
}