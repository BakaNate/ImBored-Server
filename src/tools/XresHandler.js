/**
 ** Developed by Xcrowzz
 ** On 01/08/2019
 ** For project poc_newsletters
 ** Copyright (c) 2018-2019. All rights reserved.
 */

import { OK, CREATED } from './messages/validMessages';
import { FORBIDDEN, UNAUTHORIZED } from './messages/aclMessages';
import { TEAPOT } from './messages/miscMessages';
import {
  INTERNAL_SERVER_ERROR, BAD_REQUEST, NOT_FOUND, NOT_IMPLEMENTED,
} from './messages/errorMessages';


const { Xlog } = require('./Xlog.js');

// 200
const sendOK = (res) => {
  Xlog('OK', 'INF');
  return res.status(200).send(OK);
};

const sendOKWithData = (obj, res) => {
  Xlog(`OK: ${JSON.stringify(obj)}`, 'INF');
  return res.status(200).send(obj);
};

const sendCreated = (obj, res) => {
  Xlog(`Created: ${JSON.stringify(obj)}`, 'INF');
  return res.status(201).send(res.__(CREATED));
};

// 400
const throwBadRequest = (err, res) => {
  Xlog(err, 'ERR');
  return res.status(400).send(res.__(BAD_REQUEST));
};

const throwUnauthorized = (err, res) => {
  Xlog(err, 'ERR');
  return res.status(401).send(UNAUTHORIZED);
};

const throwForbidden = (err, res) => {
  Xlog(err, 'ERR');
  return res.status(403).send(FORBIDDEN);
};

const throwNotFound = (err, res) => {
  Xlog(err, 'ERR');
  return res.status(404).send(NOT_FOUND);
};

const throwTeaPot = (res) => {
  Xlog(TEAPOT, 'INF');
  return res.status(418).send(TEAPOT);
};

// 500
const throwIntServerError = (err, res) => {
  Xlog(err, 'ERR');
  return res.status(500).send(INTERNAL_SERVER_ERROR);
};

const throwNotImplemented = (err, res) => {
  Xlog(NOT_IMPLEMENTED, 'ERR');
  return res.status(501).send(NOT_IMPLEMENTED);
};

module.exports = {
  sendOK,
  sendOKWithData,
  sendCreated,
  throwBadRequest,
  throwUnauthorized,
  throwForbidden,
  throwNotFound,
  throwTeaPot,
  throwIntServerError,
  throwNotImplemented,
};
