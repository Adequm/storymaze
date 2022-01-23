<template>
	<div style="position: relative">
		<div style="position: absolute">
			<pre v-text="playerMode"/>
			<pre v-text="player"/>
		</div>

		<div class="wrap" :class="{ lowOpacity: playerMode.type == 'camera' }">
			<Cube 
				ref="cube"
				:currentFloor="currentFloor"
				:myId="myId"
				:world="world"
				:updateKeys="updateKeys"
				:cellSize="cellSize"
				:cubeSizes="cubeSizes"
				:player="player"
				:cameraLocal="cameraLocal"
				:hoverCell="hoverCell"
				:dynamicOfGame="world.dynamicOfGame"
				:matrixCubeItems="matrixCubeItems[cameraLocal.floor]"
				:matrixCubeEntities="matrixCubeEntities[cameraLocal.floor]"
				:style="{ transform: cubeRotateStyle }"
				:key="keyUpdateCubeSize"
				@hoverCellHandler="lodash.assign(hoverCell, $event)"
				@clickInChunk="addBrick"
			/>
		</div>

	</div>
</template>

<script>
import _ from 'lodash';
import Cube from '@/components/playground/Cube';
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';
import playerMoveMixin from '@/modules/mixins/playerMove.mixin';
import playerUseMixin from '@/modules/mixins/playerUse.mixin';
import playerBuildMixin from '@/modules/mixins/playerBuild.mixin';

export default {
	name: 'game_page',

	layout: 'game',

	mixins: [
		playerBuildMixin,
		playerMoveMixin, 
		playerUseMixin,
	],

	components: {
		Cube,
	},

	data: () => ({
		lodash: _,
		hoverCell: {
			x: null, y: null, pos: null, 
			xD: null, yD: null, posD: null,
			xU: null, yU: null, posU: null,
		},
	}),

	computed: {
		...mapState(['cameraLocal', 'myId', 'myWorld', 'playerMode', 'updateKeys']),
		...mapGetters('settings', ['keyCodesForEvents']),
		...mapGetters([
			'player',
			'keyUpdateCubeSize',
			'cubeSizes',
			'entities', 
			'world', 
			'currentFloor',
			'cellSize',
			'matrixCubeEntities',
			'matrixCubeItems',
		]),

		cubeRotateStyle() {
			const { x, y, z } = this.rotateCube;
			return `rotateX(${ x }deg) rotateY(${ y }deg) rotateZ(${ z }deg)`;
		},
	},

	// watch: {
	// 	hoverCell: {
	// 		deep: true,
	// 		handler({ x, y, pos, xU, yU, posU }) {
	// 			const isDrawWalls = xU == x && yU == y && posU == pos;
	// 			if(!isDrawWalls) return;
	// 			this.updateKey(this.cameraLocal.chunk);
	// 			_.assign(this.hoverCell, { 
	// 				posU: null,
	// 				xU: null, 
	// 				yU: null, 
	// 			});
	// 		}
	// 	}
	// },

	methods: {
		...mapMutations([
			'changeCameraFloor',
			'changeCameraChunk',
			'changeCameraRotate',
			'rotateCameraPlayer',
			'changePlayerMode',
			'updateEntity',
			'addEntityMove',
			'changeHealth',
			'changeCoinsEntity',
			'updateKey',
		]),

		executeAction(action, entity, payload = {}) {
			entity.action = action;
			switch(action) {
				case 'dropItem': // G
					if(!_.includes(['item', 'weapon', 'potion'], this.playerMode.type)) return;
					this.addEntityMove(entity.id);
					this.dropItemOnCell(entity, this.playerMode.slot);
					break;
				case 'takeItem': // E
					if(!this.playerMode.type) {
						this.takeItemOnCell(entity);
						this.addEntityMove(entity.id);
					} else {}
					break;
				case 'moveUp': case 'moveDown': case 'moveLeft': case 'moveRight': case 'dontMove': // WASD
					this.addEntityMove(entity.id);
					_.invoke({
						null: this.moveOnModeNull,
						camera: this.moveOnModeCamera,
						weapon: this.moveOnModeWeapon,
						potion: this.moveOnModePotion,
					}, this.playerMode.type, _.cloneDeep(entity), payload);
					break;
				case 'changeSlot0': case 'changeSlot1': case 'changeSlot2': // 1 2 3
					this.changeInventorySlot(action.slice(-1));
					break;
				case 'changeCameraMode': // M
					this.changePlayerMode({ type: this.playerMode.type == 'camera' ? null : 'camera' });
					if(!this.playerMode.type)
						this.changeCameraChunk(this.player.chunk);
					break;
				// case 'rotateCameraLeft':
				// 	this.rotateCameraPlayer(-90);
				// 	break;
				// case 'rotateCameraRight':
				// 	this.rotateCameraPlayer(90);
				// 	break;
			} 
		},

		moveOnModeNull(entity, { distance = 1 }) {
			const updatedEntity = this.getNewEntityLocation(entity, distance);
			this.updateEntity(updatedEntity);
			if(updatedEntity.id === this.myId) {
				this.changeCameraChunk(updatedEntity.chunk);
				this.rotateCameraPlayer(updatedEntity.rotate);
				this.changeCameraFloor(updatedEntity.floor);
			}
			const entitiesOnCell = this.getCellEntities(updatedEntity);
			if(!_.includes(this.myId, entitiesOnCell)) {
				for(const entityId of entitiesOnCell.filter(e => e.startsWith('enemy'))) {
					const enemy = this.myWorld.entities[entityId];
					this.changeHealth({ type: 'entities', id: entityId });
					this.changeHealth({ type: 'entities', id: this.myId, damage: enemy.attack });
					if(enemy.health <= 0) {
						this.changeCoinsEntity({ entityId: this.myId, coins: enemy.coins });
					}
				}
			}
		},
		moveOnModeCamera(entity) {
			if(entity.id !== this.myId) return;
			const newChunk = this.moveVectors[this.cameraLocal.chunk][entity.action];
			this.changeCameraChunk(newChunk);
		},
		moveOnModeWeapon(entity) {
			try {
				const slot = this.playerMode.slot;
				const weaponId = entity.inventory[slot];
				const weapon = this.myWorld.items[weaponId];
				const { x, y, floor, chunk, isNewLocation } = this.getNewEntityLocation(entity, weapon.range);
				this.changePlayerMode({ type: null, slot });
				if(isNewLocation) {
					const entitiesIds = this.matrixCubeEntities[floor][chunk][`${ x }-${ y }`];
					for(const entityId of entitiesIds) {
						const enemy = this.myWorld.entities[entityId];
						this.changeHealth({ type: 'entities', id: entityId, damage: weapon.attack });
						this.changeHealth({ type: 'items', id: weaponId, damage: enemy.defense });
						if(weapon.health <= 0) {
							this.removeFromInventory({ entity, slot });
						}
						if(enemy.health <= 0) {
							this.changeCoinsEntity({ entityId: this.myId, coins: enemy.coins });
						}
					}
				} 
			} catch(err) {}
		},
		moveOnModePotion(entity) {},

		changeInventorySlot(slot) {
			const itemId = this.player.inventory[slot];
			const itemType = _.get(this.myWorld.items[itemId], 'type');
			const type = this.playerMode.type !== itemType && itemId ? itemType : null;
			this.changePlayerMode({ type, slot });
		},

		executeActionByKeydown(event) {
			event.preventDefault();
			requestAnimationFrame(() => {
				const action = _.get(this.keyCodesForEvents, event.keyCode);
				this.executeAction(action, this.player);
			})
		},

		clickInChunk() {
			try {
				const { sightPlayer } = this.$refs.cube.$refs.player;
				const moveAction = {
					top: 'moveUp',
					left: 'moveLeft',
					right: 'moveRight',
					bottom: 'moveDown', 
					center: 'takeItem',
				}[sightPlayer];
				this.executeAction(moveAction, this.player);
			} catch(err) {};
		},

	},

	mounted() {
		this.$nextTick(() => {
			window.addEventListener('keydown', this.executeActionByKeydown);
		})
	},

	beforeDestroy() {
		window.removeEventListener('keydown', this.executeActionByKeydown);
	},
};
</script>