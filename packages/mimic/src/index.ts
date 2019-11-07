#!/usr/bin/env node
/**
 * Module dependencies.
 */
import { Router } from 'express';
import * as http from 'http';
import { resolve } from 'path';
import { createApp } from './app';
import { debug } from './utils/debug';

const cwd = process.cwd();
const mainFile = resolve(cwd, 'main.js');
const templateDir = resolve(cwd, 'templates');

const { app, router } = createApp({ templateDir, });

export namespace Mimic {
    export const root: Router = router;
}

debug(`Current working dir: ${cwd}`);
require(mainFile);
/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '4086');
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
