<template>
	<div class="container">
		<template v-for="(chunkData, chunk) in chunksStyles">
	    <div 
	    	v-if="1 || player.chunk == chunk || player.oldChunk == chunk"
	    	:key="updateKeys[chunk]"
	    	class="chunk"
	    	:style="{ 
	    		transform: chunkData.transform,
	    		width: chunkData.width,
	    		height: chunkData.height,
	    	}"
	    >
	    	<span v-text="chunk"/>
	    	<CanvasWalls 
	    		:angleShare="angleShare"
	    		:walls="world.floors[cameraLocal.floor].walls[chunk]"
	    		:styles="world.styles.walls"
	    		:cellSize="cellSize"
	    		:width="chunkData.x" 
	    		:height="chunkData.y"
	    	/>
	    	<CanvasItems
	    		:world="world"
	    		:items="lodash.get(matrixCubeItems, chunk, {})"
	    		:styles="world.styles.items"
	    		:cellSize="cellSize"
	    		:width="chunkData.x" 
	    		:height="chunkData.y"
	    	/>
	    	<CanvasNPC
	    		:world="world"
	    		:entities="lodash.get(matrixCubeEntities, chunk, {})"
	    		:styles="world.styles.entities"
	    		:cellSize="cellSize"
	    		:width="chunkData.x" 
	    		:height="chunkData.y"
	    	/>
	  	</div>
	  </template>

  	<div
  		ref="frontSide"
  		v-if="cameraLocal.floor === player.floor"
  		class="chunk frontChunk"
			:style="{ 
    		transform: frontChunkStyles.transform,
    		width: `calc(${ frontChunkStyles.width } + ${ cellSize * 2 }px)`,
    		height: `calc(${ frontChunkStyles.height } + ${ cellSize * 2 }px)`,
  			'background-size': `${ cellSize * 2 }px ${ cellSize * 2 }px`,
  			'box-shadow': `inset 0 0 0 ${ cellSize }px #fff`,
    	}"
    	@mousemove="mouseMoveInChunk"
    	@mouseout="mouseOutInChunk"
    	@mousedown="mouseMoveInChunk($event, 'down')"
    	@mouseup="mouseMoveInChunk($event, 'up')"
    	@click="$emit('clickInChunk')"
  	>
  		<CanvasBuild
			  :cellSize="cellSize"
			  :angleShare="angleShare"
    		:width="+frontChunkStyles.width.slice(0, -2)" 
    		:height="+frontChunkStyles.height.slice(0, -2)"
  			:hoverCell="hoverCell"
  		/>
    	<CanvasPlayer 
    		ref="player"
    		:walls="currentFloor.walls[player.chunk]"
    		:rotate="cameraLocal.rotatePlayer"
    		:cellSize="cellSize"
    		:hoverCell="hoverCell"
    		:dynamicOfGame="dynamicOfGame"
    		:x="player.x + 1"
    		:y="player.y + 1"
    	/>
  	</div>
	</div>
</template>

<script>
import _ from 'lodash';

import CanvasWalls from '@/components/playground/canvases/CanvasWalls';
import CanvasItems from '@/components/playground/canvases/CanvasItems';
import CanvasNPC from '@/components/playground/canvases/CanvasNPC';
import CanvasPlayer from '@/components/playground/canvases/CanvasPlayer';
import CanvasBuild from '@/components/playground/canvases/CanvasBuild';

export default {
	name: 'cube',

	components: {
		CanvasWalls,
		CanvasItems,
		CanvasNPC,
		CanvasPlayer,
		CanvasBuild,
	},

	props: {
		myId: String,
		updateKeys: Object,
		currentFloor: Object,
		world: Object,
		cubeSizes: Object,
		cellSize: Number,
		dynamicOfGame: Number,
		hoverCell: Object,
		cameraLocal: Object,
		player: Object,
		matrixCubeItems: Object,
		matrixCubeEntities: Object,
	},

	data: () => ({
		lodash: _,
		angleShare: 4,
		chunksPosition: {
			back: { width: 'x', height: 'y', translate: 'z', isInvert: true, transform: 'rotateY(180deg)' },
			front: { width: 'x', height: 'y', translate: 'z' },
			left: { width: 'z', height: 'y', translate: 'x', isInvert: true, transform: 'rotateY(-90deg)' },
			right: { width: 'z', height: 'y', translate: 'x', transform: 'rotateY(90deg)' },
			top: { width: 'x', height: 'z', translate: 'y', isInvert: true, transform: 'rotateX(90deg)' },
			bottom: { width: 'x', height: 'z', translate: 'y', transform: 'rotateX(90deg) rotateY(180deg)' },
		},
	}),

	computed: {
		brickSize() {
			return this.cellSize / 16;
		},
		chunksStyles() {
			return _.reduce(this.chunksPosition, (acc, pos, chunk) => {
				const x = this.cubeSizes[pos.width];
				const y = this.cubeSizes[pos.height];
				const z = this.cubeSizes[pos.translate];
				const width = `${ x * this.cellSize }px`;
				const height = `${ y * this.cellSize }px`;
				let translatePx = z * this.cellSize / 2;
				if(pos.isInvert) translatePx *= -1;
				let transform = `translate${ pos.translate }(${ translatePx }px)`;
				if(pos.transform) transform += ` ${ pos.transform }`;
				acc[chunk] = { transform, width, height, x, y, z };
		    return acc;
			}, {});
		},
		frontChunkStyles() {
			return _.get(this.chunksStyles, this.player.chunk, {});
		}
	},

	methods: {
		mouseMoveInChunk(event, type = 'move') {
			const { x, y } = this.chunksStyles[this.player.chunk];
			const hoverOffsetX = _.clamp(_.floor(event.offsetX / this.cellSize) + 1, -1, x + 1);
			const hoverOffsetY = _.clamp(_.floor(event.offsetY / this.cellSize) + 1, -1, y + 1);

			const bX = Math.floor((event.offsetX % this.cellSize) / this.brickSize);
			const bY = Math.floor((event.offsetY % this.cellSize) / this.brickSize);
			const { angleShare: aS } = this;
			const pos = +_.findKey({
				1: bX < aS && bY < aS,
				2: bX >= aS && bX < 16-aS && bY < aS,
				3: bX >= 16-aS && bY < aS,
				4: bX < aS && bY >= aS && bY < 16-aS,
				5: bX >= aS && bX < 16-aS && bY >= aS && bY < 16-aS,
				6: bX >= 16-aS && bY >= aS && bY < 16-aS,
				7: bX < aS && bY >= 16-aS,
				8: bX >= aS && bX < 16-aS && bY >= 16-aS,
				9: bX >= 16-aS && bY >= 16-aS,
			});

			this.$emit('hoverCellHandler', {
				move: { x: hoverOffsetX, y: hoverOffsetY, pos },
				down: { xD: hoverOffsetX, yD: hoverOffsetY, posD: pos, xU: null, yU: null, posU: null },
				up: { xU: hoverOffsetX, yU: hoverOffsetY, posU: pos },
			}[type]);
		},
		mouseOutInChunk() {
			this.$emit('hoverCellHandler', { x: null, y: null, pos: null });
		},
	},
}
</script>