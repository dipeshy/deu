const express = require('express');
const { debug } = require('../lib/logger');
const { runServiceTask, } = require('./services');

const app = express();

app.get('/services/:name/:task', (req, res) => {
    const {name, task} = req.params;
    const result = runServiceTask(name)(task)(req.app.locals.config.services);

    res.json(result);
});

app.get('/server/stop', (_, res) => {
    setTimeout(() => {
        debug('Stopping service via request from web api');
        process.exit();
    });

    res.json({
        data: 'OK',
    });
});

exports.app = app;
