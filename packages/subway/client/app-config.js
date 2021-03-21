
const { resolve, } = require('path');

// {
//     tg: 'dita',
//     server: 'ws://localhost:3000',
//     port: 4000,
//     routes: [
//         { 
//             uri: /^\/product/,
//             target: 'http://localhost:5000',
//         }
//     ]
// }

const CONFIG_FILE = 'subway.config.js';

class AppConfig {
    tg = 'subway';
    server = 'ws://localhost:3000';
    port = 4000;
    routes = [];

    constructor(homeDir) {
        const configFile = resolve(homeDir, 'subway.config.js');
        try {
            const document = require(configFile);
            this.tg = document.tg || this.tg;
            this.server = document.server || this.server;
            this.port = document.port || this.port;
            this.routes = document.routes || this.routes;
        } catch(err) {
            // Warn config does not exist
            console.warn(`Config ${configFile} does not exit. Using default values`);
        }
    }
}

module.exports = {
    AppConfig,
};
