#!/usr/bin/env node

const { appContext } = require('../lib/app-context');
const { spawn } = require('child_process');
const { resolve } = require('path');
const _debug = require('debug');
const { writeFileSync, openSync, readFileSync, readSync, fstat, } = require('fs');

const PID_FILE = `${appContext.homeDir}/pid`;
const CHILD_OUTFILE = `${appContext.homeDir}/out.log`

const debug = _debug('kancha');

let childPid;
try {
    childPid = readFileSync(PID_FILE, 'utf-8');
} catch(_) {}


require('yargs')
    .usage('$0 <cmd> [args]')
    .command('start', 'Start client', x => undefined, (argv) => {
        if (childPid) {
            debug(`Client already started! pid: ${childPid}`);
            return;
        }
        start();
    })
    .command('log', 'View log from client', x => undefined, () => {
        if (!childPid) {
            debug(`No running client. Start client`);
            return;
        }
        const fd = openSync(CHILD_OUTFILE, 'r');

        let bytesRead = 0;
        const read = () => {
            let buffer;

            fstat(fd, (err, stats) => {
                const size = stats.size;
                const unreadSize = size - bytesRead;
                if (unreadSize > 0) {
                    buffer = Buffer.alloc(unreadSize);
                    bytesRead += readSync(fd, buffer, 0, unreadSize, bytesRead);
                    process.stdout.write(buffer);
                }
            });
            setTimeout(read, 1000);
        };
        read();
    })
    .command('stop', 'Stop client', x => undefined, () => {
        if (!childPid) {

            debug('No running client');
            return;
        }

        debug(`Stopping client: ${childPid}`)
        try {
            if (process.kill(childPid, 'SIGTERM')) {
                debug(`Client terminated`);
            }
        } catch(_) {
            debug(`Client process not found: ${childPid}`)
        }
        writeFileSync(PID_FILE, '');
    })
    .help()
    .argv


function start() {
    var outfile = openSync(CHILD_OUTFILE, 'w');
    const child = spawn('node', [
            resolve(__dirname, '../valet/index.js')
        ], {
        env: {
            ...process.env,
            DEBUG: '@deu/subway*'
        },
        stdio: ['ignore', outfile, outfile],
        detached: true,
    });
    child.on('exit', (code) => {
        debug('Client exited with code', code);
        writeFileSync(appContext.homeDir + '/pid', '');
    });
    
    child.on('error', (err) => {
        debug('Error create client process', err);
    });
    
    child.unref();
    
    writeFileSync(appContext.homeDir + '/pid', child.pid);
    debug(`ppid: ${process.pid}, pid: ${child.pid}`);
}
