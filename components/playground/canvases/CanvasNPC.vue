<template>
	<canvas 
		style="position: absolute"
		ref="canvas"
	/>
</template>

<script>
import _ from 'lodash';

export default {
	name: 'CanvasNPC',

	props: {
		entities: Object,
		world: Object,
		styles: Object,
		cellSize: Number,
		width: Number,
		height: Number,
	},

	data: () => ({
		canvas: null,
		ctx: null,
	}),

	watch: {
		entities: {
			deep: true,
			handler: 'drawNPCs',
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

		drawNPCs() {
			if(!this.entities) return;
			const { cellSize, ctx, canvas } = this;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			for(let [xy, entitiesId] of _.toPairs(this.entities)) {
				const [x, y] = xy.split('-').map(Number);
				const xPx = x * cellSize + cellSize/4;
				const yPx = y * cellSize + cellSize/4;

				for(let entityId of entitiesId) {
					const entity = _.get(this.world.entities, entityId);
					if(!entity || entity.id == this.myId || entity.health <= 0) continue;

					ctx.fillStyle = entity.style;
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
			_.invoke(this, 'drawNPCs');
		})
	},
};
</script>