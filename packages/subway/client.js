#!/usr/bin/env node
const http = require('http');
const httpProxy = require('http-proxy');
const client = require('socket.io-client');
const axios = require('axios').default;

if (process.argv.length < 3) {
    console.log('Usage: client.js targetgroup');
    process.exit(0);
}

const config = {
    tg: process.argv[2],
    routes: []
}

const proxy = httpProxy.createProxyServer({});

var server = http.createServer(function(req, res) {
    // You can define here your custom logic to handle the request
    // and then proxy the request.
    proxy.web(req, res, { target: 'http://localhost:5000' });
});

const socket = client.io(`ws://localhost:3000`, {
    query: {
        tg: config.tg,
    }
});

socket.on('request', async (message) => {
    console.log(message);
    const method = message.method;

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
        baseURL: `http://localhost:4003${message.path}`,
        ...request,
    });

    socket.emit('response', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
    });
});

console.log("listening on port 4003")
server.listen(4003);
