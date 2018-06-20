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
    todoList: [],
  },
  getters: {
    getLoading(state) {
      return state.loading;
    },
    getCurrentLoggedInUserId(state) {
      return state.uid;
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
    setTodoList(state, data) {
      state.todoList = data;
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
    submitTodoToFirebase({ commit, state }, payload) {
      commit('setLoading', true);
      firebase
        .database()
        .ref(`todo-list/${state.uid}`)
        .push(payload)
        .then(() => commit('setLoading', false));
    },
    getAllTodosForUser({commit, state}) {
      let todoList = firebase
          .database()
          .ref(`todo-list/${state.uid}`);
      todoList.on('value', function (data) {
         commit('setTodoList', data.val());
      });
    },
    signOutExistingUser({ commit }, payload) {

    },
  },
});
