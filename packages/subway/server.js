const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const socket = require('socket.io');

const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json({
}));

const PORT = process.env.PORT || 4003;

const server = app.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});

const _subscriptions = {};
const io = new socket.Server(server);

app.get('/health', (_, resp) => {
    resp.json({
        health: 'OK',
    });
});

app.all('/*', (req, resp) => {
    let responded = false;
    const event = {
        method: req.method,
        path: req.path,
        params: req.params,
        headers: req.headers,
        cookies: req.cookies,
    };

    if (req.body) {
        event.body = req.body;
    }

    const targetGroup = req.headers['x-proxy-tg'];
    const client = _subscriptions[targetGroup];
    if (!(targetGroup && client)) {
        resp.statusCode = 502;
        return resp.json({
            message: `Client tg: ${targetGroup} not subscribed. Start client.js in local machine with tg configured ${targetGroup}`,
        });
    }

    client.emit('request', event)
    client.onAny((event, message) => {
        client.offAny();
        if (!responded) {
            resp.statusCode = message.status;
            resp.statusMessage = message.statusText;
            for (const [key, value] of Object.entries(message.headers || {})) {
                resp.set(key, value);
            }
            resp.send(message.data);
            responded = true;
        }
    });

    setTimeout(() => {
        client.offAny();
        if (!responded) {
            resp.statusCode = 502;
            resp.json({
                message: 'timeout'
            });
            responded = true;
        }
    }, 10000);
});


io.on('connection', (socket) => {
    const tg = socket.handshake.query.tg || 'default';
    _subscriptions[tg] = socket;
    // Note: socket is connection to single user
    socket.on('disconnect', () => {
        console.log(`user disconnected and unsubscribed from tg: ${tg}`);
        delete _subscriptions[tg];
    });
    console.log(`user connected and subscribed to tg: ${tg}`, {
        id: socket.id,
        client: socket.conn.id
    });
});
