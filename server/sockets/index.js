const _ = require('lodash');



module.exports.onConnection = socket => {

	socket.on('test', async (page = 0) => {
		try {

			socket.emit('TEST', { test: 1 });
		} catch (err) {
			console.log(err)
		}
	}); 

};