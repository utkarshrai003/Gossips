
var router = require('express').Router();

router.use('/', require('./users'));
router.use('/', require('./friend_requests'));

module.exports = router;
