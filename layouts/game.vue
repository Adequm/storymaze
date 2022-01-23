<template>
	<div>
		<Nuxt/>
	</div>
</template>

<script>
import _ from 'lodash';
import { mapMutations } from 'vuex';

export default {
	methods: {
		...mapMutations(['setWindowInnerWidth', 'setWindowInnerHeight']),
		onWindowResize() {
			this.setWindowInnerWidth(window.innerWidth);
			this.setWindowInnerHeight(window.innerHeight);
		},
	},

	mounted() {
		this.$nextTick(() => {
			_.invoke(this, 'onWindowResize');
			window.addEventListener('resize', this.onWindowResize);
		})
	},

	beforeDestroy() {
		window.addEventListener('resize', this.onWindowResize);
	},
};
</script>