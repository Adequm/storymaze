import _ from 'lodash';
import { mapGetters } from 'vuex';

export default {

	data: () => ({
		moveVectors: {
			front: { moveUp: 'top', moveLeft: 'left', moveRight: 'right', moveDown: 'bottom' },
			left: { moveUp: 'top', moveLeft: 'back', moveRight: 'front', moveDown: 'bottom' },
			back: { moveUp: 'top', moveLeft: 'right', moveRight: 'left', moveDown: 'bottom' },
			right: { moveUp: 'top', moveLeft: 'front', moveRight: 'back', moveDown: 'bottom' },
			top: { moveUp: 'back', moveLeft: 'left', moveRight: 'right', moveDown: 'front' },
			bottom: { moveUp: 'back', moveLeft: 'right', moveRight: 'left', moveDown: 'front' },
		},
	}),

	computed: {
		...mapGetters('settings', ['moveActionsExtended']),
		rotateCube() {
			const { chunk, rotatePlayer } = this.cameraLocal;
			switch(`${ chunk }-${ rotatePlayer }`) {
				case 'front-0': return { x: 0, y: 0, z: 0 };
				case 'front-90': return { x: 0, y: 0, z: 270 };
				case 'front-180': return { x: 0, y: 0, z: 180 };
				case 'front-270': return { x: 0, y: 0, z: 90 };

				case 'left-0': return { x: 270, y: 90, z: 90 };
				case 'left-90': return { x: 270, y: 180, z: 90 };
				case 'left-180': return { x: 270, y: 270, z: 90 };
				case 'left-270': return { x: 270, y: 0, z: 90 };

				case 'back-0': return { x: 0, y: 180, z: 0 };
				case 'back-90': return { x: 0, y: 180, z: 90 };
				case 'back-180': return { x: 0, y: 180, z: 180 };
				case 'back-270': return { x: 0, y: 180, z: 270 };

				case 'right-0': return { x: 270, y: 270, z: 270 };
				case 'right-90': return { x: 270, y: 0, z: 270 };
				case 'right-180': return { x: 270, y: 90, z: 270 };
				case 'right-270': return { x: 270, y: 180, z: 270 };

				case 'top-0': return { x: 270, y: 0, z: 0 };
				case 'top-90': return { x: 270, y: 90, z: 0 };
				case 'top-180': return { x: 270, y: 180, z: 0 };
				case 'top-270': return { x: 270, y: 270, z: 0 };

				case 'bottom-0': return { x: 90, y: 180, z: 0 };
				case 'bottom-90': return { x: 90, y: 90, z: 0 };
				case 'bottom-180': return { x: 90, y: 0, z: 0 };
				case 'bottom-270': return { x: 90, y: 270, z: 0 };
			}
		},
	},


	methods: {

		getCellEntities({ floor, chunk, x, y }) {
			return _.get(this.matrixCubeEntities, `[${ floor }][${ chunk }][${ x }-${ y }]`, {});
		},

		getCellWalls({ floor, chunk, x, y }) {
			return _.get(this.world, `floors[${ floor }].walls[${ chunk }][${ x }-${ y }]`, {});
		},

		canEntityMoveTo(oldEntity, newEntity) {
			const actionIndex = _.indexOf(this.moveActionsExtended, oldEntity.action);
			const currentCell = this.getCellWalls(oldEntity);
			const nextCell = this.getCellWalls(newEntity);
			const currentInside = +_.get(currentCell, `inside[${ actionIndex % 4 }]`, 0);
			const nextOutside = +_.get(nextCell, `outside[${ (actionIndex + 2) % 4 }]`, 0);
			return !currentInside && !nextOutside;
		},

		getNewEntityLocation(entity, range = 1) {
			entity.old = _.cloneDeep(entity);
			const newEntityLocation = _.invoke({
				moveUp: this.moveUp,
				moveDown: this.moveDown,
				moveLeft: this.moveLeft,
				moveRight: this.moveRight,
			}, entity.action, entity, range) || entity;

			const { teleport } = this.getCellWalls(newEntityLocation);
			if(teleport) {
				const [floor, chunk, x, y] = teleport.split('#');
				_.assign(newEntityLocation, { floor, chunk, x: +x, y: +y });
			}

			newEntityLocation.isNewLocation = newEntityLocation.x !== entity.old.x ||
				newEntityLocation.y !== entity.old.y ||
				newEntityLocation.chunk !== entity.old.chunk ||
				newEntityLocation.floor !== entity.old.floor;

			return this.canEntityMoveTo(entity.old, newEntityLocation) 
				? newEntityLocation
				: entity.old;
		},

		moveUp(entity, range) {
			entity.y -= range;
			if(!this.checkNewSide(entity)) return entity;
			entity.chunk = this.moveVectors[entity.chunk].moveUp;
			switch(entity.old.chunk) {
				case 'front': return this.moveConvert(entity, { y: 'cZ', rC: 'x-' });
				case 'left': return this.moveConvert(entity, { y: 'x', x: '0', rP: 90 });
				case 'back': return this.moveConvert(entity, { y: '0', x: 'cXiX', rP: 180 });
				case 'right': return this.moveConvert(entity, { y: 'cYiX', x: 'cX', rP: 270 });
				case 'top': return this.moveConvert(entity, { y: '0', x: 'cXiX', rP: 180 });
				case 'bottom': return this.moveConvert(entity, { y: 'cY' });
				default: return entity;
			};
		},

		moveLeft(entity, range) {
			entity.x -= range;
			if(!this.checkNewSide(entity)) return entity;
			entity.chunk = this.moveVectors[entity.chunk].moveLeft;
			switch(entity.old.chunk) {
				case 'front': return this.moveConvert(entity, { x: 'cZ' });
				case 'left': return this.moveConvert(entity, { x: 'cX' });
				case 'back': return this.moveConvert(entity, { x: 'cZ' });
				case 'right': return this.moveConvert(entity, { x: 'cX' });
				case 'top': return this.moveConvert(entity, { x: 'y', y: '0', rP: -90 });
				case 'bottom': return this.moveConvert(entity, { x: 'cZiY', y: 'cY', rP: 90 });
				default: return entity;
			}
		},

		moveRight(entity, range) {
			entity.x += range;
			if(!this.checkNewSide(entity)) return entity;
			entity.chunk = this.moveVectors[entity.chunk].moveRight;
			switch(entity.old.chunk) {
				case 'front': return this.moveConvert(entity, { x: '0' });
				case 'left': return this.moveConvert(entity, { x: '0' });
				case 'back': return this.moveConvert(entity, { x: '0'});		
				case 'right': return this.moveConvert(entity, { x: '0' });
				case 'top': return this.moveConvert(entity, { y: '0', x: 'cZiY', rP: 90 });
				case 'bottom': return this.moveConvert(entity, { x: 'y', y: 'cY', rP: -90 });
				default: return entity;
			}
		},

		moveDown(entity, range) {
			entity.y += range;
			if(!this.checkNewSide(entity)) return entity;
			entity.chunk = this.moveVectors[entity.chunk].moveDown;
			switch(entity.old.chunk) {
				case 'front': return this.moveConvert(entity, { x: 'cXiX', y: 'cZ', rP: 180 });
				case 'left': return this.moveConvert(entity, { x: 'cX', y: 'x', rP: 90 });
				case 'back': return this.moveConvert(entity, { y: '0' });
				case 'right': return this.moveConvert(entity, { x: '0', y: 'cYiX', rP: -90 });
				case 'top': return this.moveConvert(entity, { y: '0' });
				case 'bottom': return this.moveConvert(entity, { x: 'cXiX', y: 'cY', rP: 180 });
				default: return entity;
			}
		},





		checkNewSide({ x, y, chunk, action }) {
			const { x: cX, y: cY, z: cZ } = this.cubeSizes;
			switch(`${ action }-${ chunk }`) {
				case 'moveUp-front': 
				case 'moveUp-left': 
				case 'moveUp-back': 
				case 'moveUp-right': 
				case 'moveUp-bottom': 
				case 'moveUp-top': return y < 0;

				case 'moveDown-front':
				case 'moveDown-left':
				case 'moveDown-back':
				case 'moveDown-right': return y >= cY;
				case 'moveDown-top': 
				case 'moveDown-bottom': return y >= cZ;

				case 'moveLeft-front':
				case 'moveLeft-left': 
				case 'moveLeft-back': 
				case 'moveLeft-right': 
				case 'moveLeft-top': 
				case 'moveLeft-bottom': return x < 0;

				case 'moveRight-front':
				case 'moveRight-back': 
				case 'moveRight-top':
				case 'moveRight-bottom': return x >= cX;
				case 'moveRight-left': 
				case 'moveRight-right': return x >= cZ;
			}
		},

		moveConvert(entity, { x, y, rP = 0 }) {
			const copy = {};
			entity.rotate = rP;
			for(const [axis, key] of _.toPairs({ x, y })) {
				if(!key) continue;
				copy[axis] = {
					x: entity.x + 0,
					y: entity.y + 0,
					0: 0,
					cX: this.cubeSizes.x - 1,
					cY: this.cubeSizes.y - 1,
					cZ: this.cubeSizes.z - 1,
					cXiX: this.cubeSizes.x - 1 - entity.x,
					cYiX: this.cubeSizes.z - 1 - entity.x,
					cZiX: this.cubeSizes.y - 1 - entity.x,
					cXiY: this.cubeSizes.x - 1 - entity.y,
					cYiY: this.cubeSizes.y - 1 - entity.y,
					cZiY: this.cubeSizes.z - 1 - entity.y,
				}[key];
			}
			return { ...entity, ...copy };
		},

	},
};
