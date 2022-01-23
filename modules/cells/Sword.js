import Weapon from './Weapon.js';

export default class Sword extends Weapon {

	constructor(props = {}) {
		super(props);
		this.strength = props.strength || 5;
	}

	useItem() {
		return new Promise(async (resolve, reject) => {
			if(this.itemUsedInClass.sword) return reject();
			this.itemUsedInClass.sword = true;
			await super.useItem();
			this.itemUsedInClass.sword = false;
			resolve();
		})
	}

	damageItem(damageForce = 1) {
		if(this.strength <= 0) return;
		this.strength -= damageForce;
		console.log('Sword: ', this.strength);
		return this.strength > 0;
	}
}