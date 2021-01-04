'use strict';

import { Router } from 'express';

import token from '../../../lib/token';
import { generate } from '../../../lib/packet';

import { createUser, getUserWith } from '../../../controllers/user';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/sso', sso);

async function signup (req, res, next) {
    try {
        const user = await createUser(req.body);
		const newToken = token.create(user);
		const result = { user, token: newToken, };

		res.json(generate(result));
    } catch(err) {
        next(err);
    }
}

async function signin (req, res, next) {
    try {
        const uid = req.body.uid;
        const password = req.body.password;
        const user = await getUserWith(uid, password);

		const newToken = token.create(user);
		const result = { user, token: newToken, };

		res.json(generate(result));
    } catch(err) {
        next(err);
    }
}

async function sso (req, res, next) {
    try {
        res.json({ success: true });
    } catch(err) {
        next(err);
    }
}

export default router;