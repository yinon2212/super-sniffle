const express = require('express');
const router = express.Router();

const CodeController = require('../controllers/code.controller');


router.get('/', (req, res) => {
    res.send('GET FROM CODE.ROUTE.JS');
});

router.get('/get-code/:id', CodeController.getCode);

router.post('/share', CodeController.shareCode);

module.exports = router;