<template>
	<canvas 
		style="position: absolute"
		ref="canvas"
	/>
</template>

<script>
import _ from 'lodash';

export default {
	name: 'CanvasItems',

	props: {
		items: Object,
		world: Object,
		styles: Object,
		cellSize: Number,
		width: Number,
		height: Number,
	},

	data: () => ({
		canvas: null,
		ctx: null,
		brickShare: 4,
	}),

	watch: {
		items: {
			deep: true,
			handler: 'drawItems',
		},
	},

	methods: {
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

		drawItems() {
			if(!this.items) return;
			const { cellSize, ctx, canvas } = this;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			for(let [xy, itemsId] of _.toPairs(this.items)) {
				const [x, y] = xy.split('-').map(Number);
				const xPx = x * cellSize + cellSize/4;
				const yPx = y * cellSize + cellSize/4;

				for(let itemId of itemsId) {
					const item = _.get(this.world.items, itemId);
					if(!item || item.health <= 0) continue;

					ctx.fillStyle = item.style;
					ctx.save();
					ctx.translate(xPx, yPx);
					ctx.fillRect(0, 0, cellSize/2, cellSize/2);
					ctx.restore();
				}
			}
		},

	},

	mounted() {
		this.$nextTick(() => {
			_.invoke(this, 'initCanvas');
			_.invoke(this, 'drawItems');
		})
	},
};
</script>