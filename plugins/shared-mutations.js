import _ from 'lodash';
import shareMutations from 'vuex-shared-mutations';

export default ({ store }) => {
  window.onNuxtReady(nuxt => {
    shareMutations({
      predicate: (mutation, state) => {
      	return [
          'wish', 
          'color', 
          'subtitle', 
          'setBackgroundColor', 
          'dateSecondWish',
      	];
      },
    })(store);
  });
};

