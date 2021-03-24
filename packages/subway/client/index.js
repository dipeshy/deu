const { AppConfig } = require('./app-config');
const { appContext } = require('../lib/app-context');

const { main, } = require('./app')

const config = new AppConfig(appContext.homeDir);

main(config);
