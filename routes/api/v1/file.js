'use strict';

import { Router } from 'express';
import multer from 'multer';

import * as FileController from '../../../controllers/file';
import { generate } from '../../../lib/packet';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.route('/')
    .get(getFileList)
    .post(upload.any(), createAndUploadFile);
router.route('/:fileid')
    .get(getFile)
    .put(updateFile)
    .delete(removeFile);

async function createAndUploadFile(req, res, next) {
    try {
        const files = req.files;
        const category = req.body.category;
        const uploadFiles = await FileController.uploadObjects(files, category);
        res.json(generate(uploadFiles));
    } catch(err) {
        next(err);
    }
}

async function getFileList(_req, res, next) {
    try {
        const files = await FileController.getFiles();
        res.json(generate(files));
    } catch(err) {
        next(err);
    }
}

async function getFile(req, res, next) {
    try {
        const fileid = req.params.fileid;
        const file = await FileController.getFileById(fileid);
        res.json(generate(file));
    } catch(err) {
        next(err);
    }
}

async function updateFile(req, res, next) {
    try {
        const fileid = req.params.fileid;
        const input = req.body;
        const file = await FileController.updateFile(fileid, input);
        res.json(generate(file));
    } catch(err) {
        next(err);
    }
}

async function removeFile(req, res, next) {
    try {
        const fileid = req.params.fileid;
        const file = await FileController.removeFile(fileid);
        res.json(generate(file));
    } catch(err) {
        next(err);
    }
}

export default router;