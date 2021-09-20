const router = require('express').Router();
const { logoutMessage } = require('../utils/constant');

router.post('/signout', (req, res) => {
  res.clearCookie('jwt');
  res.status(200).send({ message: logoutMessage });
  res.end();
});

module.exports = router;
