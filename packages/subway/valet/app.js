const { debug } = require('../lib/logger');

const client = require('socket.io-client');
const axios = require('axios').default;
const { createProxyServer, } = require('../lib/reverse-proxy');
const { app, } = require('./admin-app');

const main = (config) => {
    // Proxy server
    createProxyServer({
        routes: config.routes
    }).listen(config.port, () => {
        debug(`Listening to reverse proxy on port:${config.port}`);
    });
    
    // Start admin
    app.locals.config = config;
    app.listen(config.adminPort, () => {
        debug(`Listening admin on port:${config.adminPort}`);
    });

    // Remote proxy. Connect to remote server
    const socket = client.io(config.server, {
        query: {
            tg: config.tg,
        }
    });
    
    socket.on('request', async (message) => {
        const { host, ...headers } = message.headers || {};
        const request = {
            method: message.method,
            headers: {
                ...headers,
                'X-Forwarded-Host': host,
            },
            params: message.params,
        };
    
        if (message.body) {
            request.data = message.body;
        }
    
        let response;
        try {
            response = await axios.request({
                baseURL: `http://localhost:${config.port}${message.path}`,
                ...request,
            });
           
        } catch (err) {
            response = err.response;
        }
    
        socket.emit('response', {
            status: response.status,
            statusText: response.statusText,
            data: response.data,
            headers: response.headers
        });
    });
}

module.exports = {
    main,
};
