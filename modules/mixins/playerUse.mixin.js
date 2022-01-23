import _ from 'lodash';
import { mapMutations } from 'vuex';

export default {

	methods: {
		...mapMutations(['addToInventory', 'removeFromInventory']),
		takeItemOnCell(entity) {
			try {
				const { floor, chunk, x, y, inventory } = entity;
				const items = this.matrixCubeItems[floor][chunk][`${ x }-${ y }`];
				for(let itemId of items) {
					const slots = _.keys(inventory).filter(i => i >= 0 && i < 9);
					const emptySlot = _.find(slots, index => !entity.inventory[index]);
					this.addToInventory({ 
						entityId: entity.id,
						slot: emptySlot, 
						itemId, 		
					});
				}
			} catch(err) {}
		},
		dropItemOnCell(entity, slot) {
			try {
				const { floor, chunk, x, y, inventory } = entity;
				const items = _.get(this.matrixCubeItems, `[${ floor }][${ chunk }][${ x }-${ y }]`, []);
				if(items.length) return;
				this.removeFromInventory({ entity, slot });
			} catch(err) {}
		},
	},
};