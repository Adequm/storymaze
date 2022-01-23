import Item from './Item.js';

export default class Potion extends Item {

	constructor(props = {}) {
		super(props);
		this.potionName = props.potionName || 'Название';
		this.type = 'potion';
	}

	useItem(store) {
		return new Promise(async (resolve, reject) => {
			if(this.itemUsedInClass.potion) return reject();
			this.itemUsedInClass.potion = true;
			await super.useItem();
			console.log('Potion');
			setTimeout(() => {
				store.dispatch(
					'player/impactHealth', 
					_.random(-50, 50), 
					{ root: true }
				);
				this.itemUsedInClass.potion = false;
				resolve();
			}, 100); 
		})
	}
}