#!/usr/bin/env node

import { Router } from 'express';
import * as http from 'http';
import { resolve } from 'path';
import yargs from 'yargs';
import { createApp } from './app';
import { debug } from './utils/debug';

const argv = yargs
    .usage('Usage: [-d app-dir] [-p port]')
    .alias('d', ['app-dir'])
    .alias('p', ['port'])
    .default({
        d: process.cwd(),
        p: '4086',
    })
    .argv;

// =========
// Variables
// =========
const appPath = argv.d;
const port = normalizePort(process.env.PORT || argv.p);

const mainFile = resolve(appPath, 'main.js');
const templateDir = resolve(appPath, 'templates');

const { app, router } = createApp({ templateDir, });

export namespace Mimic {
    export const root: Router = router;
}

debug(`Current working dir: ${appPath}`);
require(mainFile);
/**
 * Get port from environment and store in Express.
 */
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string): number {
    return parseInt(val, 10);
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            debug(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            debug(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening(): void {
    const addr: any = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
