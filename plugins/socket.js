import Vue from 'vue';
import io from 'socket.io-client';
import VueSocketIOExt from 'vue-socket.io-extended';
 
 
export default ({ store }) => {
  Vue.use(VueSocketIOExt, io(location.origin), { 
  	store,
		actionPrefix: 'socket_',
		mutationPrefix: 'SOCKET_',
  });
}