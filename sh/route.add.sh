#!/bin/bash

if [ -z $1 ]; then
  echo '\nusage: $ route.add.sh <route name>\n'
  exit 0
fi

name=$1
cap="$(tr '[:lower:]' '[:upper:]' <<< ${name:0:1})${name:1}"

BASE_PATH=$(pwd -P)

touch $BASE_PATH/db/models/$1.js
touch $BASE_PATH/controllers/$1.js
touch $BASE_PATH/routes/api/v1/$1.js

/bin/cat <<EOM > $BASE_PATH/db/models/$1.js
'use strict';

import { Schema, model, } from 'mongoose';

const ${cap}Schema = new Schema({
}, { timestamps: true, });

export default model('${cap}', ${cap}Schema);
EOM

/bin/cat <<EOM > $BASE_PATH/controllers/$1.js
'use strict';

import ServiceError from '../lib/ServiceError';
import packet from '../lib/packet';

import ${cap} from '../db/models/$1';

export const create${cap} = async (input) => {
    const $1 = await ${cap}.create(input);
    return $1;
};

export const get${cap}s = async () => {
    const $1s = await ${cap}.find();
    return $1s;
};

export const get${cap}ById = async ($1id) => {
    if (!$1id) {
        throw new ServiceError(packet.errcode.param.wrong);
    }
    const $1 = await ${cap}.findById($1id);
    return $1;
};

export const update${cap} = async ($1id, input) => {
    if (!$1id) {
        throw new ServiceError(packet.errcode.param.wrong);
    }
    const $1 = await ${cap}.findByIdAndUpdate($1id, { \$set: input }, { new: true });
    return $1;
};

export const remove${cap} = async ($1id) => {
    if (!$1id) {
        throw new ServiceError(packet.errcode.param.wrong);
    }
    const $1 = await ${cap}.findById($1id);
    await $1.remove();
    return $1;
};
EOM

/bin/cat <<EOM > $BASE_PATH/routes/api/v1/$1.js
'use strict';

import { Router } from 'express';

import * as ${cap}Controller from '../../../controllers/$1';
import { generate } from '../../../lib/packet';

const router = Router();

router.route('/')
    .get(get${cap}List)
    .post(create${cap});
router.route('/:$1id')
    .get(get${cap})
    .put(update${cap})
    .delete(remove${cap});

async function create${cap}(req, res, next) {
    try {
        const $1 = await ${cap}Controller.create${cap}(req.body);
        res.json(generate($1));
    } catch(err) {
        next(err);
    }
}

async function get${cap}List(_req, res, next) {
    try {
        const $1s = await ${cap}Controller.get${cap}s();
        res.json(generate($1s));
    } catch(err) {
        next(err);
    }
}

async function get${cap}(req, res, next) {
    try {
        const $1id = req.params.$1id;
        const $1 = await ${cap}Controller.get${cap}ById($1id);
        res.json(generate($1));
    } catch(err) {
        next(err);
    }
}

async function update${cap}(req, res, next) {
    try {
        const $1id = req.params.$1id;
        const input = req.body;
        const $1 = await ${cap}Controller.update${cap}($1id, input);
        res.json(generate($1));
    } catch(err) {
        next(err);
    }
}

async function remove${cap}(req, res, next) {
    try {
        const $1id = req.params.$1id;
        const $1 = await ${cap}Controller.remove${cap}($1id);
        res.json(generate($1));
    } catch(err) {
        next(err);
    }
}

export default router;
EOM