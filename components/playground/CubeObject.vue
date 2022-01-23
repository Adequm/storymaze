<template>
	<div class="wrap" :style="{ width: `${ 7 * cellSize }px`, height: `${ 7 * cellSize }px` }">
		<div class="container">
	    <div 
	    	v-for="(chunkData, chunk) in chunksStyles"
	    	class="chunk"
	    	:style="{ 
	    		background: '#21a8',
	    		transform: chunkData.transform,
	    		width: chunkData.width,
	    		height: chunkData.height,
	    	}"
	    />
		</div>
	</div>
</template>

<script>
import _ from 'lodash';

export default { 
	name: 'CubeObject',

	props: {
		cellSize: Number,
		width: Number,
		height: Number,
		depth: Number,
		x: Number,
		y: Number,
		z: Number,
	},

	data: () => ({
		lodash: _,
		chunksPosition: {
			back: { width: 'width', height: 'height', translate: 'depth', isInvert: true, transform: 'rotateY(180deg)' },
			front: { width: 'width', height: 'height', translate: 'depth' },
			left: { width: 'depth', height: 'height', translate: 'width', isInvert: true, transform: 'rotateY(-90deg)' },
			right: { width: 'depth', height: 'height', translate: 'width', transform: 'rotateY(90deg)' },
			top: { width: 'width', height: 'depth', translate: 'height', isInvert: true, transform: 'rotateX(90deg)' },
			bottom: { width: 'width', height: 'depth', translate: 'height', transform: 'rotateX(90deg) rotateY(180deg)' },
		},
	}),

	computed: {
		chunksStyles() {
			const abc = { width: 'x', height: 'y', depth: 'z' };
			return _.reduce(this.chunksPosition, (acc, pos, chunk) => {
				const x = this[pos.width];
				const y = this[pos.height];
				const z = this[pos.translate];
				const width = `${ x }px`;
				const height = `${ y }px`;
				let translatePx = z / 2;
				if(pos.isInvert) translatePx *= -1;
				let transform = `translate${ abc[pos.translate] }(${ translatePx }px)`;
				if(pos.transform) transform += ` ${ pos.transform }`;
		    return _.assign(acc, { [chunk]: { transform, width, height, x, y, z } });
			}, {});
		},
	},
}
</script>