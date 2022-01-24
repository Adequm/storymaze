const _ = require('lodash');

const players = {};

module.exports.onConnection = socket => {

	socket.on('firstConnect', async myId => {
		try {
			players[myId] = {
				id: myId,
				type: 'player',
				name: 'playerName',
				floor: 'floor1',
				chunk: 'front',
				x: 2,
				y: 2,
				effects: {},
				inventory: {
					0: null,
					1: null,
					2: null,
				},
				coins: 0,
				health: 4,
			}
			socket.join(myId);
			socket.emit('ADD_PLAYER', players[myId]);
			for(let playerId in _.omit(players, myId)) {
				socket.to(myId).emit('ADD_PLAYER', players[playerId]);
			}
			console.log(_.keys(players))
		} catch (err) {
			console.log(err)
		}
	}); 

};