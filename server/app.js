const _ = require('lodash');
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { onConnection } = require('./sockets/');
io.on('connection', onConnection);

module.exports = { app, server, io };