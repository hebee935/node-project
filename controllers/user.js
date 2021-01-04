'use strict';

import bcrypt from 'bcryptjs';

import ServiceError from '../lib/ServiceError';
import packet from '../lib/packet';

import User from '../db/models/user';

export const createUser = async function (body) {
    const uid = body.uid;
    const password = body.password;
    if (!(uid && password)) {
        throw new ServiceError(packet.errcode.param.wrong);
    }

    const user = new User({ uid, password });
    await user.save();

    return user;
};

export const getUserWith = async function (uid, password) {
    if (!uid || !password) {
        throw new ServiceError(packet.errcode.param.wrong);
    }
    const findUser = await User.findOne({ uid, });
	if (!findUser) {
		throw new ServiceError(packet.errcode.user.notfound);
	} else if (bcrypt.compareSync(password, findUser._hashed_password) === false) {
		throw new ServiceError(packet.errcode.user.wrongPassword);
    }

    return findUser;
};

export const getUserById = async function (id) {
    const findUser = await User.findById(id);
    if (!findUser) {
        throw new ServiceError(packet.errcode.user.notfound);
    }
    return findUser;
};

export const updateUser = async (userid, input) => {
    if (!userid) {
        throw new ServiceError(packet.errcode.param.wrong);
    }
    const user = await User.findByIdAndUpdate(userid, { $set: input }, { new: true });
    return user;
};

export const removeUser = async (userid) => {
    if (!userid) {
        throw new ServiceError(packet.errcode.param.wrong);
    }
    const user = await User.findById(userid);
    user.active = false;
    await user.save();
    return user;
};
