<template>
	<canvas 
		style="position: absolute"
		ref="canvas"
	/>
</template>

<script>
import _ from 'lodash';

export default {
	name: 'CanvasWalls',

	props: {
		walls: Object,
		styles: Object,
		cellSize: Number,
		angleShare: Number,
		width: Number,
		height: Number,
	},

	data: () => ({
		canvas: null,
		ctx: null,
		// hoverX: null,
		// hoverY: null
	}),

	computed: {
		// watchKeyHoverXY() {
		// 	return `${ this.hoverX }-${ this.hoverY }`;
		// },
		cellShares() {
			return _.chain(16)
		    .times()
				.toPairs()
		    .fromPairs()
		    .mapValues(share => this.cellSize * share / 16)
		    .value();
		},
		brickSize() {
			return this.cellShares[this.angleShare];
		},
		cellAnglesShare() {
			return [
		  	[0, 0], 
		  	[16 - this.angleShare, 0], 
		  	[16 - this.angleShare, 16 - this.angleShare], 
		  	[0, 16 - this.angleShare]
		  ];
		},
		cellAnglesSize() {
			return _.map(this.cellAnglesShare, this.convertSharesToSizes);
		},
		cellWallsShare() {
			return [
				[this.angleShare, 0, 16 - this.angleShare*2, this.angleShare],
				[16 - this.angleShare, this.angleShare, this.angleShare, 16 - this.angleShare*2],
				[this.angleShare, 16 - this.angleShare, 16 - this.angleShare*2, this.angleShare],
				[0, this.angleShare, this.angleShare, 16 - this.angleShare*2],
			];
		},
		cellWallsSize() {
			return _.map(this.cellWallsShare, this.convertSharesToSizes);
		},
	},

	watch: {
		// onResize: 'onReady',
		// watchKeyHoverXY: 'changeXY',
	},

	methods: {
		convertSharesToSizes(shares) {
			return _.castArray(shares).map(share => this.cellShares[share]);
		},
		// onReady() {
		// 	try {
		// 		_.invoke(this, 'initCanvas');
		// 		_.invoke(this, 'drawWalls');
		// 	} catch(err) {
		// 		console.error(err);
		// 	}
		// },

		initCanvas() {		
			try {
				const scale = window.devicePixelRatio;
				this.canvas = _.get(this.$refs, `canvas`);
				this.ctx = this.canvas.getContext('2d');
				this.canvas.width = this.width * scale * this.cellSize;
				this.canvas.height = this.height * scale * this.cellSize;
				this.ctx.scale(scale, scale);
			} catch (err) {
				console.warn(err);
			}
		},

		drawWalls() {
			if(!this.walls) return;
			const { cellSize, ctx, canvas } = this;

		  // const neighboringCells = [[0, -1], [1, 0], [0, 1], [-1, 0]];

			const typesImage = {
				'01': 'default-dot-linear',
				'10': 'default-dot-linear',
				'00': 'default-dot-outerСorner',
				'11': 'default-dot-innerСorner',
			};


			ctx.clearRect(0, 0, canvas.width, canvas.height);
			for(let [xy, currentCell] of _.toPairs(_.omit(this.walls, ['style']))) {
				const [x, y] = xy.split('-').map(Number);
				const xPx = x * cellSize;
				const yPx = y * cellSize;

				// const neighbors = _.map(neighboringCells, ([neighborX, neighborY]) => {
				// 	const neighborXY = `${ x + neighborX }-${ y + neighborY }`;
				// 	const neighbor = _.get(this.walls, neighborXY, {});
				// 	return _.assign({}, neighbor, { xy: neighborXY });
				// });

				for(let index = 0; index < this.cellAnglesSize.length; index++) {	
					if(!+currentCell.drawAngles[index]) continue;

					const angle = this.cellAnglesSize[index];

					const currentTurn = +currentCell.drawWalls[index];
					const prevTurn = +currentCell.drawWalls[(index + 3) % 4];
					const turnKey = `${ currentTurn }${ prevTurn }`;
					let typeImage = typesImage[turnKey];

					const [imgOffsetAngleX, imgOffsetAngleY] = this.cellAnglesSize[index]
						.map(offset => offset ? this.brickSize : 0);

					const imgOffsetX = angle[0] + imgOffsetAngleX;
					const imgOffsetY = angle[1] + imgOffsetAngleY;

					/* 
					const neighborTop = _.get(neighbors, index, {});
					const neighborLeft = _.get(neighbors, (index + 3) % 4, {});
					if((neighborTop.inside || neighborLeft.inside) && xy == '1-2') {
						const neighborSide = neighborTop.inside || neighborLeft.inside;
						const neighborAngleKey = `${ +neighborSide[(index + 2) % 4] }${ +neighborSide[(index + 3) % 4] }`;

						if(_.includes(neighborAngleKey, '1')) {
							typeImage = 'default-dot-innerСorner';

							const img = new Image();
							img.src = _.sample(_.castArray(this.styles['default-dot-outerСorner']));
							img.addEventListener('load', function() {

								const [abc, bca] = angles[index].map(offset => offset ? brickSizeShare : 0);

								ctx.save();
								ctx.translate(x * cellSize, y * cellSize);
								ctx.translate(imgOffsetX, imgOffsetY);
								ctx.rotate((Math.PI / 180) * index * 90);

								if(index === 0 && neighborTop.inside) {
									ctx.translate(brickSize, 0);
								}
								if(index === 1 && neighborLeft.inside) {
									ctx.translate(0, brickSize);
								}

								// if(angleKey == '10') {
								// 	ctx.rotate((Math.PI / 180) * 90);
								// 	ctx.translate(0, -brickSize);
								// }

							  ctx.drawImage(img, 0, 0, brickSize, brickSize);
							  ctx.restore();
							}, false);

						}

						console.log({ 
							xy, 
							angleKey, 
							index, 
							neighborLeft,
							neighborTop, 
							neighborAngleKey
						})

						if(
							typeImage === 'default-dot-green' &&
							(
								typesImage[neighbor1AngleKey] === typeImage ||
								typesImage[neighbor2AngleKey] === typeImage ||
								typesImage[neighbor1AngleKey] === 'default-dot-outerСorner' ||
								typesImage[neighbor2AngleKey] === 'default-dot-outerСorner' ||
								typesImage[neighbor2AngleKey] === 'default-dot-innerСorner' ||
								typesImage[neighbor2AngleKey] === 'default-dot-innerСorner'
							)
						) typeImage = 'default-dot-linear'

					} */

					const img = new Image();
					img.src = _.sample(_.castArray(this.styles[typeImage]));
					img.addEventListener('load', () => {
						ctx.save();
						ctx.translate(xPx, yPx);
						ctx.translate(imgOffsetX, imgOffsetY);
						ctx.rotate((Math.PI / 180) * index * 90);

						if(turnKey == '10') {
							ctx.rotate((Math.PI / 180) * 90);
							ctx.translate(0, -this.brickSize);
						}

					  ctx.drawImage(img, 0, 0, this.brickSize, this.brickSize);
					  ctx.restore();
					}, false);
					

				}

				ctx.fillStyle = '#0008';
				ctx.save();
				ctx.translate(xPx, yPx);
				for(let i = 0; i < currentCell.drawWalls.length; i++) {
					if(!+currentCell.drawWalls[i]) continue;
					ctx.fillRect(...this.cellWallsSize[i]);
				}
				ctx.restore();
			}
		},

		// mousemove({ offsetX, offsetY }) {
		// 	this.hoverX = _.floor((offsetX - 1) / this.cellSize);
		// 	this.hoverY = _.floor((offsetY - 1) / this.cellSize);
		// },

		// mouseout() {
		// 	this.hoverX = null;
		// 	this.hoverY = null;
		// },

		// changeXY() {
		// 	if(_.isNull(this.hoverX) || _.isNull(this.hoverX)) return;
		// 	this.$emit('cellHover', { 
		// 		x: _.max([0, this.hoverX]), 
		// 		y: _.max([0, this.hoverY]), 
		// 	});
		// },
	},

	mounted() {
		// this.$nextTick(this.onReady);
		this.$nextTick(() => {
			_.invoke(this, 'initCanvas');
			_.invoke(this, 'drawWalls');
		})
	},
};
</script>