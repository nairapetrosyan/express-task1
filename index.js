const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const expressValidator = require('express-validator');
const moment = require('moment');

const app = express();
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());


const users = [];

app.get('/', (req, res) => {
    res.send('Hello World');
});


app.get('/time', (req, res) =>{
    res.send(moment().format());
})

app.get('/result', (req, res) =>{
    res.send(users.map(user=>{return user.username}));
})
app.post('/form', (req, res) => {
    req.check('username').notEmpty().withMessage('Name is required');
    req.check('gender').notEmpty().withMessage('Gender is required');
    req.check('password').notEmpty().withMessage('Password is required');
    const errors = req.validationErrors();
    if (errors) {
        res.render('addUser', {
            errors,
        });
    } else {
        const username = req.body.username;
        const password = req.body.password;
        const gender = req.body.gender;
        const agreement = req.body.agreewith? true:false;
        users.push({
            username,
            password,
            gender,
            agreement
        });
        res.redirect('/result');
    }
});

app.get('/form', (req, res)=>{
    res.render('addUser');
})


app.get('/api/time', (req, res)=>{
    res.json({
        time: new Date()
    })
})
app.post('/api/users', (req, res) =>{
    req.check('username').notEmpty().withMessage('Name is required');
    req.check('gender').notEmpty().withMessage('Gender is required');
    req.check('password').notEmpty().withMessage('Password is required').matches('(?=.*\d).{8,}').withMessage('Use a valid password(8 chars)');
    req.check('agreement').isBoolean().withMessage('should be a boolean');
    const errors = req.validationErrors();
    if (errors) {
        res.send({
            errors,
        });
    } else {
        const username = req.body.username;
        const password = req.body.password;
        const gender = req.body.gender;
        const agreement = req.body.agreewith?true:false;
        users.push({
            username,
            password,
            gender,
            agreement
        })
    }
    res.end();
});
app.get('/api/users', (req, res)=>{
    res.json(users);
})
app.listen(3000, () => {
    console.log('server started')
});

