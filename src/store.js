import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    name: '',
    email: '',
    loading: false,
    uid: '',
  },
  getters: {
    getLoading(state) {
      return state.loading;
    },
  },
  mutations: {
    setNameAndEmail(state, { name, email }) {
      state.name = name;
      state.email = email;
    },
    setLoading(state, data) {
      state.loading = data;
    },
    setUserId(state, data) {
      state.uid = data;
    },
    beforeAuth(state) {
      state.loading = true;
    },
    afterSuccessfulAuth(state, { name, email, uid }) {
      state.loading = false;
      state.name = name;
      state.email = email;
      state.uid = uid;
    },
    afterErrorAuth(state) {
      state.loading = false;
    },
  },
  actions: {
    createNewUserAccount({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('beforeAuth');
        // create new account.
        firebase
          .auth()
          .createUserWithEmailAndPassword(payload.email, payload.password)
          .then((response) => {
            commit('afterSuccessfulAuth', {
              uid: response.uid,
              ...payload,
            });
            resolve();
          })
          .catch((error) => {
            // Handle Errors here.
            commit('afterErrorAuth');
            reject(error.message);
          });
      });
    },
    signInExistingUser({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true);
        // Sign-in the user details.
        firebase
          .auth()
          .signInWithEmailAndPassword(payload.email, payload.password)
          .then((response) => {
            commit('afterSuccessfulAuth', {
              uid: response.uid,
              ...payload,
            });
            resolve();
          })
          .catch((error) => {
            // Handle Errors here.
            commit('afterErrorAuth');
            reject(error.message);
          });
      });
    },
    signOutExistingUser({ commit }, payload) {

    },
  },
});
