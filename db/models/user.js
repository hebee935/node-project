'use strict';

import { Schema, model, } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
    uid: { type: String, required: true, unique: true, },
    _hashed_password: { type: String, },
    email: { type: String, },

    firstname: { type: String, },
    lastname: { type: String, },

    active: { type: Boolean, default: true, },

    _role: { type: String, enum: ['user', 'admin'], default: 'user', },

}, { timestamps: true, });

UserSchema.virtual('password').set(function (password) {
	this._hashed_password = bcrypt.hashSync(password, 10);
});

UserSchema.set('toJSON', {
	transform: function (_doc, ret, _options) {
		delete ret._hashed_password;
		delete ret._role;
		return ret;
	}
});

export default model('User', UserSchema);