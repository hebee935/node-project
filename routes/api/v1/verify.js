'use strict';

import { Router } from 'express';

import { generate } from '../../../lib/packet';

import { getUserById } from '../../../controllers/user';

const router = Router();
router.post('/', verify);

async function verify (req, res, next) {
    try {
		const user = await getUserById(req.decoded.id);

		res.json(generate(user));
	} catch(err) {
		next(err);
	}
}

export default router;