<template>
	<canvas 
		style="margin: auto"
		ref="canvas"
	/>
</template>

<script>
import _ from 'lodash';
import { mapMutations } from 'vuex';

export default {
	name: 'CanvasBuild',

	props: {
		angleShare: Number,
		hoverCell: Object,
		cellSize: Number,
		width: Number,
		height: Number,
	},

	data: () => ({
		canvas: null,
		ctx: null,
	}),

	watch: {
		hoverCell: {
			deep: true,
			handler: 'drawBrick',
		},
	},

	methods: {
		...mapMutations(['switchBrickToMatrix', 'updateKey']),
		initCanvas() {		
			try {
				const scale = window.devicePixelRatio;
				this.canvas = _.get(this.$refs, `canvas`);
				this.ctx = this.canvas.getContext('2d');
				this.canvas.width = this.width * scale;
				this.canvas.height = this.height * scale;
				this.ctx.scale(scale, scale);
			} catch (err) {
				console.warn(err);
			}
		},

		getTranslate(pos) {
			const { cellSize, angleShare: aS } = this;
			const wS = 16 - aS*2;
			return _.mapValues({
				1: { x: 0, y: 0, dX: aS, dY: aS },
				2: { x: aS, y: 0, dX: wS, dY: aS },
				3: { x: aS+wS, y: 0, dX: aS, dY: aS },
				4: { x: 0, y: aS, dX: aS, dY: wS },
				5: { x: aS, y: aS, dX: wS, dY: wS },
				6: { x: aS+wS, y: aS, dX: aS, dY: wS },
				7: { x: 0, y: aS+wS, dX: aS, dY: aS },
				8: { x: aS, y: aS+wS, dX: wS, dY: aS },
				9: { x: aS+wS, y: aS+wS, dX: aS, dY: aS },
			}[pos], n => n * cellSize / 16);
		},

		drawBrick() {
			if(!this.hoverCell) return;
			const { cellSize, ctx, canvas } = this;
			const { x, y, pos, xD, yD, posD, xU, yU, posU } = this.hoverCell;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			if((xU && yU && posU)) {
				const xPx = (x - 1) * cellSize;
				const yPx = (y - 1) * cellSize;
				ctx.fillStyle = '#3aa6';
				
				const translate = this.getTranslate(pos);
				ctx.fillRect(translate.x + xPx, translate.y + yPx, translate.dX, translate.dY);			
			}

			// this.drawCorridor();
		},


		// drawCorridor() {
		// 	const { cellSize, ctx, canvas } = this;
		// 	const { x, y, pos, xU = x, yU = y, posU = pos, xD, yD, posD } = this.hoverCell;
			
		// 	if(xU == xD && yU == yD) return;
		// 	const minX = Math.min(xU, xD);
		// 	const maxX = Math.max(xU, xD);
		// 	const minY = Math.min(yU, yD);
		// 	const maxY = Math.max(yU, yD);

		// 	const isDrawWalls = xU == x && yU == y && posU == pos;


		// 	ctx.fillStyle = '#bc26';
		// 	_.times(maxX - minX + 1, dX => {
		// 		const xPx = (minX + dX - 1) * cellSize;
		// 		const yPx = (minY - 1) * cellSize;

		// 		const poses = [];
		// 		if(minX + dX == minX) {
		// 			poses.push(...{
		// 				1: [1, 3, 7, 9, 8],
		// 				2: [1, 3, 7, 9, 4, 8],
		// 				3: [3],
		// 				4: [1, 3, 7, 9, 2, 8],
		// 				5: [1, 3, 7, 9, 2, 4, 8],
		// 				6: [3, 9, 6],
		// 				7: [1, 3, 7, 9, 2],
		// 				8: [1, 3, 7, 9, 2, 4],
		// 				9: [9],
		// 			}[xD > xU ? posU : posD] || []);
		// 		} 
		// 		if(minX + dX == maxX) {
		// 			poses.push(...{
		// 				1: [1],
		// 				2: [1, 3, 7, 9, 6, 8],
		// 				3: [1, 3, 7, 9, 8],
		// 				4: [1, 4, 7],
		// 				5: [1, 3, 7, 9, 2, 6, 8],
		// 				6: [1, 3, 7, 9, 2, 8],
		// 				7: [7],
		// 				8: [1, 3, 7, 9, 2, 6],
		// 				9: [1, 3, 7, 9, 2],
		// 			}[xD < xU ? posU : posD] || []);
		// 		}
		// 		if(minX + dX > minX && minX + dX < maxX) {
		// 			if((posU == 1 && posD == 3) || (posU == 3 && posD == 1)) {
		// 				poses.push(1, 2, 3);
		// 			} else if((posU == 7 && posD == 9) || (posU == 9 && posD == 7)) {
		// 				poses.push(7, 8, 9);
		// 			} else poses.push(2, 8, 1, 3, 7, 9);
		// 		}

		// 		for(const pos of _.uniq(poses)) {
		// 			if(isDrawWalls) {
		// 				const type = pos % 2 ? pos == 5 ? null : 'drawAngles' : 'drawWalls';
		// 				const side = { 1: 0, 2: 0, 3: 1, 4: 3, 6: 1, 7: 3, 8: 2, 9: 2 }[pos];
		// 				this.switchBrickToMatrix({ floor: 'floor1', chunk: 'front', x: minX + dX, y: minY, type, side });	
		// 			} else {
		// 				const translate = this.getTranslate(pos);
		// 				ctx.fillRect(translate.x + xPx, translate.y + yPx, translate.dX, translate.dY);
		// 			}
		// 		}	
		// 	})
		// },
	},

	mounted() {
		this.$nextTick(() => {
			_.invoke(this, 'initCanvas');
			_.invoke(this, 'drawBrick');
		})
	},
};
</script>