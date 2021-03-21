
const { resolve, } = require('path');
const USER_ROOT = require('os').homedir();
const { AppConfig } = require('./app-config');
const { AppContext } = require('./app-context');
const { tryMakeDir, } = require('../lib/file-utils');
const { main, } = require('./app')

const USER_CONFIGURED_HOME = 'SUBWAY_HOME';

const context = new AppContext();
context.homeDir = process.env[USER_CONFIGURED_HOME] || resolve(USER_ROOT, '.subway');
tryMakeDir(context.homeDir);

const config = new AppConfig(context.homeDir);
context.config = config;

main(context);
