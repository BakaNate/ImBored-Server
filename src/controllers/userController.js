const User = require('../models/UserModel');
const Xres = require('../tools/XresHandler');
const utils = require('../tools/validations/userValidate');
const { sendMail } = require('../tools/Mailer');
const Xlog = require('../tools/Xlog');

async function registerUser(req, res) {
  Xlog('Someone is trying to register', '[INF]');
  if (!await utils.userValidate(req.body)) return Xres.throwBadRequest(res.__('wrong_parameters'), res);
  Xlog('Creating User', '[INF]');
  await User.createUser(req.body.userEmail, req.body.userPswd, (err, result) => {
    if (err) return Xres.throwIntServerError(err, res);
    Xlog('User Created sending Mail', '[INF]');
    sendMail(req.body.userEmail);
    return Xres.sendOKWithData({ info: result }, res);
  });
  return null;
}

async function logUser(req, res) {
  Xlog('Someone is trying to log in', '[INF]');
  if (!await utils.userValidate(req.body)) return Xres.throwBadRequest(res.__('wrong_parameters'), res);
  Xlog('Getting the user', '[INF]');
  await User.fetchUser(req.body.userEmail, req.body.userPswd, (err, result) => {
    if (err) return Xres.throwIntServerError(err, res);
    Xlog('User Found sending the data', '[INF]');
    return Xres.sendOKWithData({ auth: true, token: result }, res);
  });
  return null;
}

module.exports = {
  logUser,
  registerUser,
};
