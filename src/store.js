import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    name: '',
    email: '',
  },
  mutations: {
    setName(state, data) {
      this.state.name = data;
    },
    setEmail(state, data) {
      this.state.email = data;
    },
  },
  actions: {
    submitDataToFireBase({ commit }, payload) {
      // lets commit the payload
      commit('setName', payload.name);
      commit('setEmail', payload.email);
      // lets send to the firebase database.
      firebase.database().ref('users/').push().set({
        name: payload.name,
        email: payload.email,
      });
    },
  },
});
