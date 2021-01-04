'use strict';

import winston from 'winston';
import path from 'path';
import moment from 'moment';

import config from '../config';

const { combine, label, printf } = winston.format;

const getCurrentTime = () => {
	return moment().format('YYYY-M-D hh:mm:ss-SSS');
};

const customFormat = printf(({ level, message, label }) => {
    return `${getCurrentTime()} [${label}] ${level}: ${message}`;
});

const options = {
	file: {
		level: config.env === 'local' ? 'debug' : 'info',
		filename: `${path.join(__dirname, '../logs/all-logs.log')}`,
		handleExceptions: true,
		json: true,
		maxsize: 5242880, // 5MB
		maxFiles: 10,
        format: combine(
            label({ label: config.service }),
            customFormat
        ),
	},
	console: {
		level: config.env === 'local' ? 'debug' : 'error',
		handleExceptions: false,
		json: true,
		colorize: true,
		format: combine(
            label({ label: config.service }),
            customFormat
        ),
	}
};

const logger = winston.createLogger({
	transports: [
        new winston.transports.Console(options.console),
        new winston.transports.File(options.file),
	],
	exitOnError: false,
	levels: {
		debug: 7,
		info: 6,
		notice: 5,
		warning: 4,
		error: 3,
		crit: 2,
		alert: 1,
		emerg: 0
    },
});

logger.stream = {
	write: message => {
		logger.notice(message);
	}
};

export default logger;