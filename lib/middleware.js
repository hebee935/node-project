'use strict';

import { verify, verifyAdmin, } from './token';

export const verifyToken = (req, res, next) => {
    const ver = verify(req.headers);
	if (ver) {
        req.decoded = ver;
		return next();
	}
	res.status(401).json();
};

export const verifyAdminToken = (req, res, next) => {
    const ver = verifyAdmin(req.headers);
    if (ver) {
        req.decoded = ver;
        return next();
    }
    res.status(403).json();
};