import createPersistedState from 'vuex-persistedstate';

export default ({ store }) => {
  createPersistedState({
  	paths: [
      // 'ui.wish', 
      // 'ui.color', 
      // 'ui.subtitle', 
      // 'ui.setBackgroundColor', 
      // 'ui.dateSecondWish',
  	],
  })(store)
};