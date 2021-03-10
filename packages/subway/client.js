#!/usr/bin/env node

const client = require('socket.io-client');
const axios = require('axios').default;
const { createProxyServer, } = require('./lib/reverse-proxy');

const homeDir = require('os').homedir();
const { resolve, } = require('path');
const configFile = resolve(homeDir, '.subway', 'subway.config.js');
const config = require(configFile);

createProxyServer({
    routes: config.routes
}).listen(config.port, () => {
    console.log(`reverse proxy on port ${config.port}`);
});

const socket = client.io(config.server, {
    query: {
        tg: config.tg,
    }
});

socket.on('request', async (message) => {
    console.log(message);

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

    const response = await axios.request({
        baseURL: `http://localhost:${config.port}${message.path}`,
        ...request,
    });

    socket.emit('response', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
    });
});
