# Mimic

Service to create mockserver with with zero configuration. 
Mimic uses express server with useful middlewares to provide simple
application to create mock responses.

# Usage

```javascript
// main.js
const { Mimic } = require('@deu/mimic');

Mimic.root.get('/greet', (req, res) => {
    res.json({
        data: 'hello world!'
    })
});
```
Mimic.root is basically express router mounted at root '/'
For Router mapping see [Express routing](https://expressjs.com/en/guide/routing.html)

## Examples

### Return xml document using template

Directory structure
```
root
 |- templates
 |    `- user.ejs
 `- main.js
```

Template file
```html
<!-- templates/user.ejs -->
<user><%= user.name %></user>
```

Route mapping
```javascript
// main.js
const { Mimic } = require('@deu/mimic');

const users = [
    { name: 'user-one' },
    { name: 'user-two' }
];

Mimic.root.post('/users/:userId', (req, res) => {
    res.type('text/xml; charset=utf-8');
    const userId = parseInt(req.params.userId);
    res.render('user', {
        user: users[userId - 1]
    });
});
```
