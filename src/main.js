import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import firebase from 'firebase';
import router from './router';
import store from './store';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(Vuetify);

// firebase config.
firebase.initializeApp({
  apiKey: 'AIzaSyBKh8344Qf7jTeFQtNHzINghYFVhD2K3fU',
  authDomain: 'dush-firebase.firebaseapp.com',
  databaseURL: 'https://dush-firebase.firebaseio.com',
  projectId: 'dush-firebase',
  storageBucket: 'dush-firebase.appspot.com',
  messagingSenderId: '933956829731',
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
