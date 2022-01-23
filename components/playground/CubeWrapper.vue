<template>
	<div 
		class="wrap"
		:class="{ lowOpacity: cameraLocal.isCameraMode }"
	>	
		<!-- <div class="screen" :style="{ 'clip-path': screenStyle }"/> -->
		<!-- <div class="container" style="z-index: 1">
			<div 
				v-for="borderStyle of borderStyles"
				class="chunk"
				:style="{
					...borderStyle,
					background: 'red',
					opacity: 0.5,
				}"
			/>
		</div> -->

		<slot/>
	</div>
</template>

<script>

export default {
	name: 'CubeWrapper',

	props: {
		cameraLocal: Object,
		cellSize: Number,
	},

	computed: {
		borderStyles() {
			return [
				{ 
					transform: `translateZ(${ 3.75 * this.cellSize }px) translateY(-${ 3.5 * this.cellSize }px) rotateX(90deg)`,
					width: `${ 7 * this.cellSize }px`,
					height: `${ this.cellSize / 2 }px`,
				},
				{ 
					transform: `translateZ(${ 3.75 * this.cellSize }px) translateY(${ 3.5 * this.cellSize }px) rotateX(90deg)`,
					width: `${ 7 * this.cellSize }px`,
					height: `${ this.cellSize / 2 }px`,
				},
				{ 
					transform: `translateZ(${ 3.75 * this.cellSize }px) translateX(${ 3.5 * this.cellSize }px) rotateX(90deg) rotateY(90deg)`,
					width: `${ 7 * this.cellSize }px`,
					height: `${ this.cellSize / 2 }px`,
				},
				{ 
					transform: `translateZ(${ 3.75 * this.cellSize }px) translateX(-${ 3.5 * this.cellSize }px) rotateX(90deg) rotateY(90deg)`,
					width: `${ 7 * this.cellSize }px`,
					height: `${ this.cellSize / 2 }px`,
				},
			];
		},
		screenStyle() {
			return `polygon(
				calc(50vw - ${ 3.5 * this.cellSize }px) calc(50vh - ${ 3.5 * this.cellSize }px),
				calc(50vw + ${ 3.5 * this.cellSize }px) calc(50vh - ${ 3.5 * this.cellSize }px),
				calc(50vw + ${ 3.5 * this.cellSize }px) calc(50vh + ${ 3.5 * this.cellSize }px),
				calc(50vw - ${ 3.5 * this.cellSize }px) calc(50vh + ${ 3.5 * this.cellSize }px),
			)`.replace(/\n\t+/g, '').replace(/(\,\))$/, ')');
		},
	},
}
</script>

<style scoped>

.screen {
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: #4a24;
	z-index: 2;
}
</style>