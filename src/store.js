import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

Vue.use(Vuex);

// firebase config.
firebase.initializeApp({
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    databaseURL: DB_URL,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
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
            deletingTodo: false,
        },
        uid: '',
        uncheckedTodos: [],
        markedTodos: [],
    },
    mutations: {
        setNewTodoLoading(state, data) {
            state.loadings.newTodo = data;
        },
        setMarkTodosAsDoneLoading(state, data) {
            state.loadings.markTodosAsDone = data;
        },
        setDeleteTodoLoading(state, data) {
            state.loadings.deletingTodo = data;
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
            // Initially there will be no todo-list.
            if (data) {
                const todoIds = Object.keys(data);
                todoIds.forEach((todoId) => {
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
                });
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
            return new Promise((resolve) => {
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
            const updates = {};
            payload.forEach((item) => {
                updates[`/${item.todoId}/checked`] = true;
            });
            firebase
                .database()
                .ref(`${DATABASE}/${state.uid}`)
                .update(updates)
                .then(() => commit('setMarkTodosAsDoneLoading', false));
        },
        deleteTodo({ commit, state }, payload) {
            commit('setDeleteTodoLoading', true);
            const updates = {};
            updates[`/${payload.todoId}/`] = null;
            firebase
                .database()
                .ref(`${DATABASE}/${state.uid}`)
                .update(updates)
                .then(() => commit('setDeleteTodoLoading', false));
        },
    },
});
