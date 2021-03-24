const { resolve, } = require('path');
const { tryMakeDir, } = require('../lib/file-utils');
const { debug } = require('../lib/logger');

const USER_CONFIGURED_HOME = 'SUBWAY_HOME';

class AppContext {
    homeDir; // Application homedir

    constructor() {
        const userRoot = require('os').homedir();
        this.homeDir = process.env[USER_CONFIGURED_HOME] || resolve(userRoot, '.subway');
        this.tryMakeHomeDir();
    }
    
    tryMakeHomeDir() {
        debug(tryMakeDir(this.homeDir));
    }
}

exports.appContext = new AppContext();
