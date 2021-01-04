'use strict';

import jwt from 'jsonwebtoken';

import config from '../config';
import ServiceError from './ServiceError';
import { errcode } from './packet';

export const create = (user) => {
    const tokenData = { uid: user.uid, id: user._id, role: user._role, };
	const option = { expiresIn: config.token_expired_days, };
	const secretKey = config.secret_key;

	return jwt.sign(tokenData, secretKey, option);
};

export const verify = (headers) => {
    try {
        let ver = null;
        const Auth = headers.authorization;
        console.log('serialize: Auth: ', Auth);

        if (Auth) {
            const token = Auth.replace('Bearer ', '');
            ver = jwt.verify(token, config.secret_key);

            console.log('serialize ver: ', JSON.stringify(ver));
        }

		return ver;
    } catch(err) {
        throw new ServiceError(errcode.wrongToken);
    }
};

export const verifyAdmin = (headers) => {
	try {
        let ver = null;
        const Auth = headers.authorization;
        console.log('serialize: Auth: ', Auth);

        if (Auth) {
            const token = Auth.replace('Bearer ', '');
            ver = jwt.verify(token, config.secret_key);

            if (ver.role !== 'admin') {
                throw new ServiceError(errcode.user.notAdmin);
            }

            console.log('serialize ver: ', JSON.stringify(ver));
        }

		return ver;
    } catch(err) {
        throw new ServiceError(errcode.wrongToken);
    }
};