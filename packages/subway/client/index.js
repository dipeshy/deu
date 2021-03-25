const { AppConfig } = require('./app-config');
const { debug } = require('../lib/logger');
const { appContext } = require('../lib/app-context');

const { main, } = require('./app')

const config = new AppConfig(appContext.homeDir);

main(config);

process.on('SIGTERM', shutdown);
process.on('SIGHUP', shutdown);

function shutdown(code) {
    debug(`closing client. Signal: ${code}`);
    process.exit(0);
}