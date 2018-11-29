<template>
    <div>
        <v-alert v-model="error" dismissible type="error">
            {{ error }}
        </v-alert>
        <v-card>
            <v-toolbar color="light-green" dark>
                <v-toolbar-title>
                    Vue-Firebase Todo App
                </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-form v-model="valid" method="post" @submit.prevent="loginOrRegister">
                    <v-checkbox
                        color="green"
                        label="New user ?"
                        v-model="newUser"
                    ></v-checkbox>
                    <v-text-field
                        v-if="newUser"
                        v-model="name"
                        :rules="nameRules"
                        :counter="10"
                        label="Name"
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="email"
                        :rules="emailRules"
                        label="E-mail"
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="password"
                        :append-icon="passwordVisible ? 'visibility' : 'visibility_off'"
                        :append-icon-cb="() => (passwordVisible = !passwordVisible)"
                        :type="passwordVisible ? 'text' : 'password'"
                        :rules="passwordRules"
                        name="input-10-1"
                        label="Enter your password"
                        required
                    ></v-text-field>
                    <v-btn
                        type="submit"
                        color="success"
                        :disabled="!valid"
                        :loading="loginLoading"
                        @click="loginOrRegister">
                        {{ newUser? 'Register' : 'Login' }}
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
    data: () => ({
        valid: false,
        name: '',
        nameRules: [
            v => !!v || 'Name is required',
            // @TODO: store the length
            v => v.length <= 20 || 'Name must be less than 20 characters',
        ],
        email: '',
        emailRules: [
            v => !!v || 'E-mail is required',
            v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
        ],
        password: '',
        passwordRules: [
            v => !!v || 'Password is required',
            v => v.length >= 8 || 'Password must be atleast 8 characters',
        ],
        passwordVisible: false,
        // by default we show the login screen
        newUser: false,
        error: '',
    }),
    computed: mapState({
        loginLoading: state => state.loadings.login,
    }),
    methods: {
        login(payload) {
            return this.signInExistingUser(payload);
        },
        register(payload) {
            return this.createNewUserAccount(payload);
        },
        loginOrRegister() {
            let promise;
            const loginPayload = {
                email: this.email,
                password: this.password,
            };
            if (this.newUser) {
                promise = this.register({
                    name: this.name,
                    ...loginPayload,
                });
            } else {
                promise = this.login(loginPayload);
            }

            promise
                .then(() => this.$router.push('/'))
                .catch((error) => {
                    this.error = error;
                });
        },
        ...mapActions([
            'createNewUserAccount',
            'signInExistingUser',
        ]),
    },
};
</script>
