import _ from 'lodash';

import Cell from './Cell.js';

export default class Item extends Cell {

	constructor(props = {}) {
		super(props);
		this.itemUsedInClass = {};
	}

	useItem() {
		return new Promise(async (resolve, reject) => {
			if(this.itemUsedInClass.item) return reject();
			this.itemUsedInClass.item = true;
			console.log('Item');
			setTimeout(() => {
				this.itemUsedInClass.item = false;
				resolve();
			}, 100); 
		})
	}
}