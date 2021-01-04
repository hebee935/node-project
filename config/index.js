'use strict';

const config = require(`./${process.env.NODE_ENV || 'local' }.json`);
export default config;