import _ from 'lodash';
import { mapMutations } from 'vuex';

export default {

	methods: {
		...mapMutations(['switchBrickToMatrix']),
		addBrick() {
			const { floor, chunk } = this.cameraLocal;
			const { x, y, pos, xD, yD } = this.hoverCell;
			const type = pos % 2 ? pos == 5 ? null : 'drawAngles' : 'drawWalls';
			if(!type || x != xD || y != yD) return;
			const side = { 1: 0, 2: 0, 3: 1, 4: 3, 6: 1, 7: 3, 8: 2, 9: 2 }[pos];
			this.switchBrickToMatrix({ floor, chunk, x: x - 1,	y: y - 1, type, side });
			this.updateKey(chunk);
		},

	},
};