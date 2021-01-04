'use strict';

import { errcode } from './packet';
const unknownError = errcode.unknown;

export default class ServiceError extends Error {
	constructor(errcode, status = null, orgError = null) {
		let message = unknownError.msg;
		if (errcode && errcode.msg) {
			message = errcode.msg;
		} else if (orgError && orgError.message) {
			message = orgError.message;
		}

		super(message);
		this.name = 'ServiceError';
		if (errcode && errcode.code) {
			this.code = errcode.code;
		} else {
			this.code = unknownError.code;
		}
		this.msg = message;
		this.status = status || 200;
		this.orgError = orgError;
	}

	toErrorJson() {
		if (this.orgError) {
			console.log('origianl Error: ', this.orgError);
		}
		return {
			success: false,
			code: this.code,
			message: this.msg,
		};
	}
}