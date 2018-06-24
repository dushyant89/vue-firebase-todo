import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';

Vue.use(Vuex);

// firebase config.
firebase.initializeApp({
    apiKey: 'AIzaSyBKh8344Qf7jTeFQtNHzINghYFVhD2K3fU',
    authDomain: 'dush-firebase.firebaseapp.com',
    databaseURL: 'https://dush-firebase.firebaseio.com',
    projectId: 'dush-firebase',
    storageBucket: 'dush-firebase.appspot.com',
    messagingSenderId: '933956829731',
});

const DATABASE = 'todo-list';

export default new Vuex.Store({
    state: {
        name: '',
        email: '',
        loadings: {
            login: false,
            newTodo: false,
            markTodosAsDone: false,
            getAllTodos: false,
        },
        uid: '',
        uncheckedTodos: [],
        markedTodos: [],
    },
    getters: {
        loginLoading(state) {
            return state.loadings.login;
        },
        newTodoLoading(state) {
            return state.loadings.newTodo;
        },
        markTodosAsDoneLoading(state) {
            return state.loadings.markTodosAsDone;
        },
        getAllTodosLoading(state) {
            return state.loadings.getAllTodos;
        },
        getCurrentLoggedInUserId(state) {
            return state.uid;
        },
        getUnCheckedTodos(state) {
            return state.uncheckedTodos;
        },
        getTodosMarkedAsDone(state) {
            return state.markedTodos;
        },
    },
    mutations: {
        setNameAndEmail(state, { name, email }) {
            state.name = name;
            state.email = email;
        },
        setLoginLoading(state, data) {
            state.loadings.login = data;
        },
        setNewTodoLoading(state, data) {
            state.loadings.newTodo = data;
        },
        setMarkTodosAsDoneLoading(state, data) {
            state.loadings.markTodosAsDone = data;
        },
        setAllTodosLoading(state, data) {
            state.loadings.getAllTodos = data;
        },
        setUserId(state, data) {
            state.uid = data;
        },
        setTodoList(state, data) {
            /**
             * The structure should be like
             * { todoId, todo, checked }
             * */
            state.markedTodos = [];
            state.uncheckedTodos = [];
            for (let todoId in data) {
                if (data[todoId].checked) {
                    state.markedTodos.push({
                        todoId,
                        ...data[todoId],
                    });
                } else {
                    state.uncheckedTodos.push({
                        todoId,
                        ...data[todoId],
                    });
                }
            }
        },
        beforeAuth(state) {
            state.loadings.login = true;
        },
        afterSuccessfulAuth(state, { name, email, uid }) {
            state.loadings.login = false;
            state.name = name;
            state.email = email;
            state.uid = uid;
        },
        afterErrorAuth(state) {
            state.loadings.login = false;
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
                commit('beforeAuth');
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
            return new Promise((resolve, reject) => {
                commit('setNewTodoLoading', true);
                firebase
                    .database()
                    .ref(`${DATABASE}/${state.uid}`)
                    .push(payload)
                    .then(() => {
                        commit('setNewTodoLoading', false);
                        resolve();
                    });
            });
        },
        getAllTodosForUser({ commit, state }) {
            commit('setAllTodosLoading', true);
            const todoList = firebase
                .database()
                .ref(`${DATABASE}/${state.uid}`);
            todoList.on('value', (data) => {
                commit('setTodoList', data.val());
                commit('setAllTodosLoading', false);
            });
        },
        getCurrentUser({ commit }) {
            return new Promise((resolve, reject) => {
                const user = firebase.auth().currentUser;
                // if there is a logged in user.
                if (user) {
                    commit('setUserId', user.uid);
                    resolve();
                } else {
                    reject();
                }
            });
        },
        markTodosAsDone({ commit, state }, payload) {
            commit('setMarkTodosAsDoneLoading', true);
            let updates = {};
            payload.forEach((item) => {
                updates[`/${item.todoId}/checked`] = true;
            });
            firebase
                .database()
                .ref(`${DATABASE}/${state.uid}`)
                .update(updates)
                .then(() => commit('setMarkTodosAsDoneLoading', false));
        },
    },
});
