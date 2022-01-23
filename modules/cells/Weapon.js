import Item from './Item.js';

export default class Weapon extends Item {

	constructor(props = {}) {
		super(props);
		this.weaponName = props.weaponName || 'Название';
		this.type = 'weapon';
	}

	useItem() {
		return new Promise(async (resolve, reject) => {
			if(this.itemUsedInClass.weapon) return reject();
			this.itemUsedInClass.weapon = true;
			await super.useItem();
			console.log('Weapon');
			setTimeout(() => {
				this.itemUsedInClass.weapon = false;
				resolve();
			}, 100); 
		})
	}
}