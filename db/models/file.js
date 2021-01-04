'use strict';

import { Schema, model, } from 'mongoose';

const FileSchema = new Schema({
    name: { type: String, required: true, },
    mimetype: { type: String, default: '', },
    user: { type: Schema.Types.ObjectId, },
    category: { type: String, default: 'Application/octet-stream', },
    size: { type: Number, },
    _path: { type: String, },
}, { timestamps: true, });

export default model('File', FileSchema);