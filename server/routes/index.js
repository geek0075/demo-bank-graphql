var express = require('express');
var router = express.Router();
const path = require('path');

const send_index = (res) => {
    const cwd = process.cwd();
    const index_path = path.join(cwd, 'dist/vm-bank', 'index.html');
    res.sendFile(index_path);
};

/* GET home page. */
router.get('/', function(req, res, next) {
    send_index(res);
});

router.get('/home', (req, res, next) => {
    send_index(res);
});

router.get('/dashboard', (req, res, next) => {
    send_index(res);
});

router.get('/dashboard/balance', (req, res, next) => {
    send_index(res);
});

router.get('/dashboard/transactions', (req, res, next) => {
    send_index(res);
});

router.get('/dashboard/deposit', (req, res, next) => {
    send_index(res);
});

router.get('/dashboard/withdraw', (req, res, next) => {
    send_index(res);
});

router.get('/login', (req, res, next) => {
    send_index(res);
});

router.get('/register', (req, res, next) => {
    send_index(res);
});

module.exports = router;
