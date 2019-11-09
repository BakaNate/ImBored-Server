const Ddos = require('ddos');
const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/Auth');

const logger = require('../tools/logger');


const router = express.Router();
const ddos = new Ddos({ burst: 5, limit: 10 });
router.use(ddos.express);

router.route('/')
  .get(logger.myLogger, (req, res) => { res.status(200).send(res.__('hello')); });

router.route('/register')
  .post(logger.myLogger, userController.registerUser);

router.route('/login')
  .post(logger.myLogger, userController.logUser);

router.route('/rooms')
  .post(logger.myLogger, userController.getRooms);

router.route('/admin')
  .get(logger.myLogger, authController.isAuthenticated);

module.exports = router;
