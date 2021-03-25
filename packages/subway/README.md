# Subway

## Client

Create config at home
mkdir ~/.subway
touch ~/.subway/subway.config.js

~/.subway/subway.config.js
```javascript
module.exports = {
    tg: 'dipesh',
    server: 'ws://remote-server:3000',
    port: 4000,
    routes: [
        {
            uri: /^\/products/,
            target: 'http://localhost:5000'
        }
    ]
}
```