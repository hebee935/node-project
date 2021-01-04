'use strict';

export const objectCopy = (a = {}, b) => {
	return Object.assign(a, b);
};

export const getPublicIP = (req) => {
	if (req.headers['x-forwarded-for']) return req.headers['x-forwarded-for'];
	else return req.socket.remoteAddress;
};