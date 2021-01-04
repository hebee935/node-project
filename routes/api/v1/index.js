'use strict';

import { Router } from 'express';
import morgan from 'morgan';

import logger from '../../../lib/logger';
import ServiceError from '../../../lib/ServiceError';
import { errcode } from '../../../lib/packet';
import { verifyToken } from '../../../lib/middleware';

import signRoute from './sign';
import userRoute from './user';
import verifyRoute from './verify';
// import fileRoute from './file';

morgan.token('user', function(req, _res) { return req.decoded && req.decoded.uid; });

const router = Router();

router.use('/', signRoute);

router.use(verifyToken);

router.use('/verify', verifyRoute);
router.use('/user', userRoute);
// router.use('/file', fileRoute);

router.use((_req, res, _next) => {
	res.status(404).json({});
});

router.use((err, _req, res, _next) => {
	logger.warning(err);
	console.log(err);
	if (err && err.name === 'ServiceError') {
		return res.status(err.status || 500).json(err.toErrorJson());
	}
	if (err && err.name === 'MongoError') {
		const dbError = new ServiceError(errcode.mongo(err.code, err.errmsg), 200, err);
		return res.status(dbError.status).json(dbError.toErrorJson());
	}
	if (err && err.name === 'CastError' && err.kind === 'ObjectId') {
		const idError = new ServiceError(errcode.param.objectid, 200, err);
		idError.msg = err.message;  // override ServiceError msg;
		return res.status(idError.status).json(idError.toErrorJson());
	}
	logger.error(JSON.stringify(err, null, 4));
	res.status(err.status || 500).json({ msg: err.message });
});

export default router;