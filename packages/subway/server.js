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

const server = app.listen(3000, () => {
    console.log('listening on *:3000');
});

const _subscriptions = {};
const io = new socket.Server(server);

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
        return resp.json({
            message: 'default response',
        });
    }

    // io.emit('request', event);
    client.emit('request', event)
    client.onAny((event, message) => {
        client.offAny();
        if (!responded) {
            resp.statusCode = message.status;
            resp.statusMessage = message.statusText;
            resp.json(message.data);
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
    const ns = socket.handshake.query.tg || 'default';
    _subscriptions[ns] = socket;
    // Note: socket is connection to single user
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    console.log('a user connected', {
        id: socket.id,
        client: socket.conn.id
    });
});
