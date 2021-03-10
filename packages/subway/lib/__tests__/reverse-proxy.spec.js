const {
    expect,
    describe,
    it,
    beforeAll,
    afterAll,
} = require('@jest/globals');
const supertest = require('supertest');
const { createProxyServer, } = require('../reverse-proxy');
const nock = require('nock');

const routes = [
    { uri: /^\/product/, target: 'http://localhost:9999'},
];

const server = createProxyServer({
    routes,
});

const request = supertest(server);

describe('reverse-proxy', () => {
    let scope;
    beforeAll(() => {
        scope = nock('http://localhost:9999');
    });
    afterAll(() => {
        scope.done();
    });

    it('returns 501 for unmapped routes', async () => {
        const { status, } = await request
            .get('/fruits');

        expect(status).toBe(501);

        expect.assertions(1);
    });

    it('returns proxied response', async () => {
        scope.get('/product/v1/products')
            .reply(200, [
                { name: 'apple', },
                { name: 'ball', },
            ]);

        const { status, body, } = await request
            .get('/product/v1/products');


        expect(status).toBe(200);
        expect(body).toEqual([
            { name: 'apple', },
            { name: 'ball', },
        ]);
        expect.assertions(2);
        scope.done();
    });
});
