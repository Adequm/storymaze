import _ from 'lodash';
import Vue from 'vue';

import Item from '@/modules/cells/Item';

export const state = () => ({
	backpack: _.fromPairs(_.times(12, slot => [slot + 1, null])),
	isBackpackBig: false,
});


export const getters = {
	playerBackpack({ backpack, isBackpackBig }) {
		if(isBackpackBig) return backpack;
		return _.pick(backpack, [1, 2, 3]);
	}
};


export const actions = {
	async useItemFromBackpack({ getters, dispatch }, slotBackpackId) {
		try {
			const item = _.get(getters.playerBackpack, slotBackpackId);
			if(item instanceof Item) {
				const dispatchType = {
					weapon: 'useWeaponFromBackpack',
					potion: 'usePotionFromBackpack',
				}[item.type];
				if(!dispatchType) throw Error(`does not exist [dispatchType=${ item.type }]`);
				await dispatch(dispatchType, { slotBackpackId, item });
			}
		} catch(err) {
			console.warn(err);
		}
	},
	async useWeaponFromBackpack({ commit, dispatch }, { slotBackpackId, item }) {
		const status = await item.useItem({ dispatch });
		commit('damageItemFromBackpack', { item, damageForce: 1 });
		if(item.strength > 0) return;
		commit('deleteItemFromBackpack', slotBackpackId);
	},
	async usePotionFromBackpack({ commit, dispatch }, { slotBackpackId, item }) {
		const status = await item.useItem({ dispatch });
		commit('deleteItemFromBackpack', slotBackpackId);
	},
	test(){
		console.log('test')
	}
};


export const mutations = {
	putItemInBackpack({ backpack }, { slotBackpackId, item }) {
		Vue.set(backpack, slotBackpackId, item);
	},
	deleteItemFromBackpack({ backpack }, slotBackpackId) {
		Vue.set(backpack, slotBackpackId, null);
		console.log('destroy slot ', slotBackpackId)
	},
	damageItemFromBackpack({ backpack }, { item, damageForce }) {
		_.invoke(item, 'damageItem', damageForce);
	},
	swapItemsInBackpack({ backpack }, [slotBackpackId1, slotBackpackId2]) {
		const item1 = _.get(backpack, slotBackpackId1, null);
		const item2 = _.get(backpack, slotBackpackId2, null);
		Vue.set(backpack, slotBackpackId1, item2);
		Vue.set(backpack, slotBackpackId2, item1);
	}
};