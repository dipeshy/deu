const axios = require('axios');
const {
    readFileSync,
    writeFileSync,
} = require('fs');
const {
    resolve,
} = require('path');


class Document {
    constructor(url) {
        this.url = new URL(url);
        this.name = this.url.pathname.split('/').pop();
    }

    isFile() {
        return this.url.protocol === 'file:';
    }

    isHTTP() {
        return this.url.protocol === 'http:' || this.url.protocol === 'https:';
    }

    async fetch() {
        let document;
        if (this.isFile()) {
            document = readFileSync(this.url.href.replace(/file:\/\//, ''));
        } else if (this.isHTTP()) {
            const { data } = await axios.get(this.url.href);
            document = data;
        } else {
            throw new Error('Unknown protocol for url:' + this.url.href)
        }
        
        return document;
    }

    static save = (dir) => (file) => (data) => {
        writeFileSync(resolve(dir, file), data);
    }
}


module.exports = {
    Document,
};