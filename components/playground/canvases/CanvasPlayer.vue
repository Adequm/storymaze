<template>
	<div 
		class="player"
		:style="{
			width: `${ size }px`,
			height: `${ size }px`,
			top: `${ cellSize * y + (cellSize - size)/2 }px`,
			left: `${ cellSize * x + (cellSize - size)/2 }px`,
			transform: `rotate(${ rotate || 0 }deg)`
		}"
	>
		<div
			v-if="sightPlayer && !isNotWall"
			class="player-direction"
			:style="playerDirection[sightPlayer]"
		>
			<div
				:key="sightPlayer"
				class="player-direction-status"
				:style="{ animation: `slidein ${ dynamicOfGame/1000 }s linear` }"
				:class="{ noAnimation: sightPlayer === 'center' }"
			/>
		</div>
	</div>
</template>

<script>
import _ from 'lodash';

export default {
	name: 'CanvasPlayer',

	props: {
		walls: Object,
		dynamicOfGame: Number,
		showArrow: Boolean,
		rotate: Number,
		cellSize: Number,	
		hoverCell: Object,
		x: Number,
		y: Number,
	},

	computed: {
		isNotWall() {
			return 0;
			// const sides = ['top', 'right', 'bottom', 'left'];
			// const neighborCell = _.get(this.walls, `${ this.hoverCell.x - 1 }-${ this.hoverCell.y - 1 }`, {});
			// const currentCell = _.get(this.walls, `${ this.x - 1 }-${ this.y - 1 }`, {});
			// const sightPlayer = this.sightPlayer.replace('long_', '');
			// const sightPlayerIndex = _.indexOf(sides, sightPlayer);
			// const neighborWall = +_.get(neighborCell.inside, (sightPlayerIndex + 2) % 4, 0);
			// const currentWall = +_.get(currentCell.outside, sightPlayerIndex, 0);
			// return currentWall || neighborWall;
		},
		size() {
			return this.cellSize * 0.5;
		},
		sightPlayer() {
			const { x, y, hoverCell } = this;
			if((hoverCell.x === x) && (hoverCell.y === y - 1)) return 'top';
			else if((hoverCell.x === x) && (hoverCell.y === y + 1)) return 'bottom';
			else if((hoverCell.x === x - 1) && (hoverCell.y === y)) return 'left';
			else if((hoverCell.x === x + 1) && (hoverCell.y === y)) return 'right';
			// else if((hoverCell.x === x) && (hoverCell.y === y - 2)) return 'long_top';
			// else if((hoverCell.x === x) && (hoverCell.y === y + 2)) return 'long_bottom';
			// else if((hoverCell.x === x - 2) && (hoverCell.y === y)) return 'long_left';
			// else if((hoverCell.x === x + 2) && (hoverCell.y === y)) return 'long_right';
			else if((hoverCell.x === x) && (hoverCell.y === y)) return 'center';
			else return null;
		},
		playerDirection() {
			return {
				top: { top: `-${ this.size }px`, transform: `rotate(270deg)` },
				bottom: { top: `${ this.size }px`, transform: `rotate(90deg)` },
				left: { left: `-${ this.size }px`, transform: `rotate(180deg)` },
				right: { left: `${ this.size }px` },
				long_top: { top: `-${ this.size }px`, transform: `rotate(270deg)` },
				long_bottom: { top: `${ this.size }px`, transform: `rotate(90deg)` },
				long_left: { left: `-${ this.size }px`, transform: `rotate(180deg)` },
				long_right: { left: `${ this.size }px` },
				center: { 'clip-path': 'none' }
			};
		},

	},
}
</script>

<style scoped>
.player {
	pointer-events: none;
	position: absolute;
	background: red;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	font-size: 50%;
}

.player-direction {
	position: absolute;
	width: 100%;
  height: 100%;
	background: #333;
	clip-path: polygon(0 30%, 50% 30%, 50% 10%, 100% 50%, 50% 90%, 50% 70%, 0 70%);
}

.player-direction-status {
	position: absolute;
	height: 100%;
	width: 100%;
	background: black;
}

</style>