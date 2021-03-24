const debug = require('debug');

const {
    name,
    version,
} = require('../package.json');
const createLogger = (ns) => {
    return debug(ns)
}

module.exports = {
    debug: createLogger(`${name}@${version}`),
};
