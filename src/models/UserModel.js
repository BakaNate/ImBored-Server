import jwt from 'jsonwebtoken';
import INTERNAL_SERVOR_ERROR from '../tools/messages/errorMessages';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Constants = require('../tools/Constants');

const constant = new Constants();

const secret = constant.SECRET;

const UserSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    maxLength: 254,
    unique: true,
  },
  userPswd: {
    type: String,
    required: true,
    minLength: 16,
    maxLength: 254,
    select: false,
  },
  userRooms: {
    type: [String],
    maxLength: 254,
  },
});

UserSchema.statics.createUser = async function (userEmail, userPswd, cb) {
  const hashedPswd = await bcrypt.hash(userPswd, 8);
  if (!hashedPswd) return cb(new Error(INTERNAL_SERVOR_ERROR));
  await this.model('User').create({
    userEmail,
    userPswd: hashedPswd,
  }, (err, record) => {
    if (err) return cb(err);
    return cb(null, record);
  });
  return null;
};

UserSchema.statics.fetchUser = async function (userEmail, userPswd, cb) {
  await this.findOne({ userEmail }, async (err, user) => {
    if (err) return cb(err);
    if (!user) return cb(new Error('User not found'));
    const isValid = await bcrypt.compare(userPswd, user.userPswd);
    if (isValid === true) {
      // eslint-disable-next-line no-underscore-dangle
      const token = jwt.sign({ id: user._id }, secret, { expiresIn: 86400 });
      return cb(null, token);
    }
    return cb(new Error('Invalid Credentials'));
  }).select('+userPswd');
};

UserSchema.statics.addRoom = async function (userEmail, room, cb) {
  if (!userEmail || !room) return;
  await this.findOne({ userEmail }, async (err, user) => {
    if (err) return cb(err);
    if (!user) return cb(new Error('User not found'));
    const newRoom = await user.userRooms.indexOf(room);
    if (newRoom === -1) {
      user.userRooms.push(room);
      user.save();
    }
    return cb(null, user);
  });
};

UserSchema.statics.getUserRooms = async function (userEmail, cb) {
  if (!userEmail) return cb(new Error(INTERNAL_SERVOR_ERROR));
  await this.findOne({ userEmail }, async (err, user) => {
    if (err) return cb(err);
    if (!user) return cb(new Error('User not found'));
    const rooms = user.userRooms;
    return cb(null, rooms);
  });
  return null;
};
module.exports = mongoose.model('User', UserSchema);
