'use strict';

import AWS from 'aws-sdk';

import config from '../config';
import ServiceError from '../lib/ServiceError';
import packet from '../lib/packet';

import File from '../db/models/file';

const s3 = new AWS.S3({
    region: config.aws.region,
	accessKeyId: config.aws.access_key_id,
	secretAccessKey: config.aws.secret_access_key,
});

export const getFiles = async () => {
    const files = await File.find();
    return files;
};

export const getFileById = async (fileid) => {
    if (!fileid) {
        throw new ServiceError(packet.errcode.param.wrong);
    }
    const file = await File.findById(fileid);
    return file;
};

export const updateFile = async (fileid, input) => {
    if (!fileid) {
        throw new ServiceError(packet.errcode.param.wrong);
    }
    const file = await File.findByIdAndUpdate(fileid, { $set: input }, { new: true });
    return file;
};

export const removeFile = async (fileid) => {
    if (!fileid) {
        throw new ServiceError(packet.errcode.param.wrong);
    }
    const file = await File.findById(fileid);
    await file.remove();
    return file;
};

export const uploadObjects = async (files, category = '') => {
    const result = [];
    for (let i = 0; i < files.length; i++) {
        const buffer = files[i].buffer;
        const file = new File({
            name: files[i].originalname,
            mimetype: files[i].mimetype,
            size: files[i].size,
            category,
        });
        file._path = `${category}/${file._id}`;
        await uploadToS3(file._path, buffer, file.mimetype);
        result.push(await file.save());
    }
    return result;
};

const uploadToS3 = (path, buffer, mimetype) => {
    const params = {
        Bucket: config.aws.s3_bucket,
        Key: path,
        Body: buffer,
        ContentType: mimetype,
    };
    return s3.putObject(params).promise();
};

export const getObject = (file) => {
    const params = {
        Bucket: config.aws.s3_bucket,
        Key: file._path,
    };
    return s3.getObject(params);
};