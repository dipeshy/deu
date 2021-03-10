const http = require('http');
const httpProxy = require('http-proxy');

const createProxyServer = ({routes, }) => {
    const proxy = httpProxy.createProxyServer({});

    const server = http.createServer((req, res) => {
        for (const { uri, target, } of routes) {
            if (uri.test(req.url)) {
                proxy.web(req, res, { target, });
                return;
            }
        }

        res.statusCode = 501;
        res.statusMessage = 'Not implemented';
        res.end();
    });

    return server;
};

module.exports = {
    createProxyServer,
};
