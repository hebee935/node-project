'use strict';

import { Router } from 'express';

import * as UserController from '../../../controllers/user';
import { generate } from '../../../lib/packet';

const router = Router();

router.route('/')
    .get(getUserList);
router.route('/:userid')
    .get(getUser)
    .put(updateUser)
    .delete(removeUser);

async function getUserList(_req, res, next) {
    try {
        const users = await UserController.getUsers();
        res.json(generate(users));
    } catch(err) {
        next(err);
    }
}

async function getUser(req, res, next) {
    try {
        const userid = req.params.userid;
        const user = await UserController.getUserById(userid);
        res.json(generate(user));
    } catch(err) {
        next(err);
    }
}

async function updateUser(req, res, next) {
    try {
        const userid = req.params.userid;
        const input = req.body;
        const user = await UserController.updateUser(userid, input);
        res.json(generate(user));
    } catch(err) {
        next(err);
    }
}

async function removeUser(req, res, next) {
    try {
        const userid = req.params.userid;
        const user = await UserController.removeUser(userid);
        res.json(generate(user));
    } catch(err) {
        next(err);
    }
}

export default router;
