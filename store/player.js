import _ from 'lodash';
import Vue from 'vue';


export const state = () => ({
	health: 100,
	impactHealthLog: [],
});


export const getters = {
	impactHealthLogLast5({ impactHealthLog }) {
		return impactHealthLog.slice(-5);
	}
};


export const actions = {
	impactHealth({ state, commit, dispatch }, effect) {
		commit('changeHealth', effect);
		if(state.health > 0) return;
		dispatch('death');
	},
	death() {
		console.log('death')
	}
};


export const mutations = {
	changeHealth(state, effect) {
		const health = Number(state.health);
		const healthNew = Math.max(0, Math.min(100, health + effect));
		state.impactHealthLog.push(effect);
		Vue.set(state, 'health', healthNew);
	}
};