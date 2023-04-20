var express = require('express');
var router = express.Router()

//route
var cml = require('../controllers/CML');
var pipes = require('../controllers/Pipes');
var thickness = require('../controllers/Thickness');
var testPoint = require('../controllers/TP');

router.use('/pipes', pipes);
router.use('/cml', cml);
router.use('/thickness', thickness);
router.use('/testPoint', testPoint);

module.exports = router;