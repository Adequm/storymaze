import _ from 'lodash';
import Vue from 'vue';

import world from '@/modules/maps/matrix';

const getMatrix = data => _.reduce(data, (matrix, drop) => {
	if(drop.pickedBy) return matrix;
	const keyMatrix = `[${ drop.floor }][${ drop.chunk }][${ drop.x }-${ drop.y }]`;
	const cellMatrix = _.get(matrix, keyMatrix, []);
	_.set(matrix, keyMatrix, cellMatrix.concat(drop.id));
	return matrix;
}, {});




export const state = () => ({
	lang: 'ru',
	world,
	myId: 'player',
	myWorld: {
		entities: {
			player: {
				canMove: true,
				moveTo: null,
				moves: 0,
				health: 4,
			}
		}
	},
	cameraLocal: {
		floor: 'floor1',
		chunk: 'front',
		isCameraMode: false,
		rotatePlayer: 0,
	},
	windowInnerWidth: 0,
	windowInnerHeight: 0,
	playerMode: {
		type: null,
		slot: null,
	},
	updateKeys: {
		front: null,
		left: null,
		back: null,
		right: null,
		top: null,
		bottom: null,
	},
});




export const getters = {
	world: ({ world, myWorld }) => _.defaultsDeep(myWorld, world),
	entities({}, { world }) {
		return _.defaultsDeep(world.entities, { player: {
			floor: 'floor1',
			chunk: 'front',
			x: 0,
			y: 0,
			effects: {},
			inventory: {
				0: null,
				1: null,
				2: null,
			},
			skills: {},
			coins: 0,
		} })
	},
	player: ({ myId }, { entities }) => entities[myId],
	currentFloor: ({ world, cameraLocal }) => _.get(world.floors, cameraLocal.floor, {}),
	cubeSizes: ({}, { currentFloor }) => currentFloor.size || { x: 0, y: 0, z: 0 },
	maxCubeSize: ({}, { cubeSizes }) => _.max(_.values(cubeSizes)),

	maxFullSize({ windowInnerWidth, windowInnerHeight }) {
		return 400;
	},
	cellSize: ({}, { maxFullSize, maxCubeSize }) => maxFullSize / maxCubeSize,

	matrixCubeEntities: ({}, { entities }) => getMatrix(entities),
	matrixCubeItems: ({}, { world }) => getMatrix(world.items),

	keyUpdateCubeSize({ cameraLocal }, { cubeSizes, maxFullSize }) {
		return `${ cubeSizes.x }-${ cubeSizes.y }-${ cubeSizes.z }-${ cameraLocal.floor }-${ maxFullSize }`;
	},
};




export const mutations = {
	setNewLocationEntity({ myWorld }, { id, x, y, chunk, floor }) {
		const entity = _.get(myWorld.entities, id);
		if(!entity) return console.log(`No entity [#${ id }]`);
		const updatedEntity = _.defaults({
			x: _.isUndefined(x) ? entity.x : x,
			y: _.isUndefined(y) ? entity.y : y,
			chunk: _.isUndefined(chunk) ? entity.chunk : chunk,
			floor: _.isUndefined(floor) ? entity.floor : floor,
		}, entity);
	},
	setWindowInnerWidth: (state, xPx) => Vue.set(state, 'windowInnerWidth', xPx),
	setWindowInnerHeight: (state, yPx) => Vue.set(state, 'windowInnerHeight', yPx),

	changeCameraFloor: ({ cameraLocal }, newFloor) => Vue.set(cameraLocal, 'floor', newFloor),
	changeCameraChunk: ({ cameraLocal }, newChunk) => Vue.set(cameraLocal, 'chunk', newChunk),
	changeCameraRotate: ({ cameraLocal }, rotate) => Vue.set(cameraLocal, 'rotatePlayer', rotate),

	changePlayerMode({ playerMode }, { type, slot }) {
		Vue.set(playerMode, 'type', type);
		Vue.set(playerMode, 'slot', slot);
	},

	rotateCameraPlayer({ cameraLocal }, rotateDeg = 0) {
		const newRotateDeg = cameraLocal.rotatePlayer + rotateDeg;
    const quadrant = Math.floor((newRotateDeg % 360) / 90);
    const slice = quadrant < 0 ? 4 + quadrant : quadrant;
    Vue.set(cameraLocal, 'rotatePlayer', slice * 90);
	},
	updateEntity({ myWorld }, updatedEntity) {
		const oldEntity = myWorld.entities[updatedEntity.id];
		oldEntity.floor = updatedEntity.floor;
		oldEntity.chunk = updatedEntity.chunk;
		oldEntity.x = updatedEntity.x;
		oldEntity.y = updatedEntity.y;
	},

	addToInventory({ myWorld }, { slot, itemId, entityId }) {
		try {
			if(_.isUndefined(itemId) || _.isUndefined(slot)) return;
			Vue.set(myWorld.entities[entityId].inventory, slot, itemId);
			Vue.set(myWorld.items[itemId], 'pickedBy', entityId);
		} catch(err) {
			console.warn(err);
		}
	},
	removeFromInventory({ myWorld, playerMode }, { slot, entity }) {
		try {
			if(_.isUndefined(slot)) return;

			const itemId = _.get(myWorld.entities[entity.id], `inventory[${ slot }]`);
			Vue.set(myWorld.entities[entity.id].inventory, slot, null);
			Vue.set(myWorld.items[itemId], 'pickedBy', null);
			Vue.set(myWorld.items[itemId], 'x', entity.x);
			Vue.set(myWorld.items[itemId], 'y', entity.y);
			Vue.set(playerMode, 'type', null);

		} catch(err) {
			console.warn(err);
		}
	},

	addEntityMove({ myWorld }, entityId) {
		const moves = _.get(myWorld.entities[entityId], 'moves', 0);
		Vue.set(myWorld.entities[entityId], 'moves', moves + 1);
	},

	changeHealth({ myWorld }, { type, id, damage = 1 }) {
		try {
			myWorld[type][id].health -= damage;
		} catch(err) {}
	},

	changeCoinsEntity({ myWorld }, { entityId, coins }) {
		myWorld.entities[entityId].coins += coins;
	},

	switchBrickToMatrix({ myWorld }, { floor, chunk, x, y, type, side, draw }) {
		try {
			const emptyCell = { inside: '0000', outside: '0000', drawWalls: '0000', drawAngles: '0000' }
			const cell = _.get(myWorld.floors, `[${ floor }].walls[${ chunk }][${ x }-${ y }]`, emptyCell);

			const drawTypes = type == 'drawWalls' ? ['inside', 'outside', type] : [type];
			for(let drawType of drawTypes) {
				const sidesCell = cell[drawType].split('');
				sidesCell[side] = _.isUndefined(draw) ? +!+sidesCell[side] : draw;
				cell[drawType] = sidesCell.join('');
			}

			Vue.set(myWorld.floors, floor, myWorld.floors[floor] || { walls: {} });
			Vue.set(myWorld.floors[floor].walls, chunk, myWorld.floors[floor].walls[chunk] || {});
			Vue.set(myWorld.floors[floor].walls[chunk], `${ x }-${ y }`, cell);
		} catch(err) {}
	},
	updateKey({ updateKeys }, key) {
		Vue.set(updateKeys, key, Date.now());
	},
};