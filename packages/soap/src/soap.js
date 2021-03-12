#!/usr/bin/env node
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const { loadWSDL, } = require('./lib/wsdl');
const {
    existsSync,
    mkdirSync,
} = require('fs');

yargs(hideBin(process.argv))
    .usage('Usage: $0 <command> [options] <url>')
    .command(
        'wsdl <url> [-o output]', 
        'download wsdl',
        // Builder
        (yargs) => {
            yargs
                .positional('url', {
                    describe: 'wsdl url',
                    type: 'string'
                })
                .option('o', {
                    alias: 'output',
                    describe: 'output dir',
                    type: 'string',
                    demand: false,
                    default: `${process.cwd()}/tmp`
                })
        },
        // Handler
        async ({
            url,
            output,
            ...rest
        }) => {
            if (!existsSync(output)) {
                mkdirSync(output);
            }
            await loadWSDL(output, url);
        })
        .demandCommand()
        .argv;
