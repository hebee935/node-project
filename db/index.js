'use strict';

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
mongoose.Promise = Promise;

import config from '../config';
import logger from '../lib/logger';

let allModels = [];

const connectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
};

export const connection = () => {
    const db = mongoose.connect(config.mongo_url, connectOptions);

    mongoose.connection.on('connected', () => logger.info(`mongo db connected to ${config.mongo_url}`));
    mongoose.connection.on('error', (err) => {
        logger.info('mongo db connection error!!');
        logger.info(err);
    });
    mongoose.connection.on('disconnected', (_err) => {
        logger.info(`mongo db disconnected to ${config.mongo_url}`);
    });

    return db;
};

export const loadModels = () => {
    const models = path.join(__dirname, './models');
    let str = 'loading ';

    fs.readdirSync(models)
        .filter(file => ~file.search(/^[^.].*\.js$/))
        .forEach(file => {
            let comp = file.split('.'), m = comp[0], schema;
            if (m.search(/^s_.+/) === 0) {
                m = m.substring(2);
            }
            m = m.charAt(0).toUpperCase() + m.slice(1);
            str += m + ', ';
            schema = require(path.join(models, file));
            allModels.push({
                name: m,
                schema: schema,
                model: (schema ? mongoose.model(m, schema) : null)
            });
        });
    logger.info(str);
};

export const checkModel = function(db) {
	let collections = [];

	// collection이 있는지 확인한다.
	return db.db.listCollections().toArray().then(function(names) {
		logger.info('check database collection...');
		// 현재 존재하는 collection의 list를 준비한다.
		for (var item of names) collections.push(item.name);
		// model에 대한 collection이 만들어 졌는지를 확인한다.
		for (var model in db.models) {
			var coll = db.models[model].collection.collectionName;
			var exists = collections.includes(coll);
			if (!exists) logger.notice('model(' + model + ') doesn\'t exists in collection');
		}
	});
};