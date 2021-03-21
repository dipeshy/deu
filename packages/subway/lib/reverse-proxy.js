const http = require('http');
const httpProxy = require('http-proxy');

const createProxyServer = ({routes, }) => {
    const proxy = httpProxy.createProxyServer({});

    const server = http.createServer((req, res) => {
        if (req.url === '/') {
            return respondWithWelcome(res);
        } else if (req.url === '/favicon.ico') {
            return respondWithFavIcon(res);
        }
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

const respondWithWelcome = (res) => {
    res.write('Hello from subway-client');
    res.end();
}

const respondWithFavIcon = (res) => {
    const favicon = new Buffer.from('AAABAAEAEBAQAAAAAAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAA/4QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEREQAAAAAAEAAAEAAAAAEAAAABAAAAEAAAAAAQAAAQAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAEAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAA//8AAP//AAD8HwAA++8AAPf3AADv+wAA7/sAAP//AAD//wAA+98AAP//AAD//wAA//8AAP//AAD//wAA', 'base64'); 
    res.statusCode = 200;
    res.setHeader('Content-Length', favicon.length);
    res.setHeader('Content-Type', 'image/x-icon');
    res.setHeader("Cache-Control", "public, max-age=2592000");
    res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
    res.end(favicon);
}
