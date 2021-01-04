'use strict';

export const errcode = {
	mongo: (code, msg) => ({ code, msg }),
    wrongToken: { code: 998, msg: 'wrong token error' },
    unknown: { code: 999, msg: 'unknown error occured' },
	param: {
		wrong: { code: 101, msg: 'wrong body or param data.' },
	},
	user: {
		notfound: { code: 1001, msg: 'not found user error' },
		wrongPassword: { code: 1002, msg: 'wrong password error' },
		notAdmin: { code: 1003, msg: 'user role not admin error' },
	},
    file: {
        notfound: { code: 2001, msg: 'not found file error' },
    },
};

export const generate = (data) => {
	const packet = { success: true, data, };
	return packet;
};

export const error = (code, msg) => {
	const packet = { success: false, code, message: msg, };
	return packet;
};