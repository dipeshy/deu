const { Mimic } = require('@deu/mimic');



Mimic.root.get('/greet', (req, res) => {
    res.json({
        data: 'hello world!'
    })
});

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
