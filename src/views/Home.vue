<template>
  <div>
      <v-layout row>
          <v-flex xs12 sm6>
              <v-form>
                  <v-layout row>
                    <v-text-field
                            v-model="todo"
                            label="Your new todo"
                            hint="I will get better at work"
                            required
                    >

                    </v-text-field>
                    <v-btn
                            color="success"
                            :loading="loading"
                            @click="submitTodo">
                      Submit
                      <v-icon right>send</v-icon>
                    </v-btn>
                  </v-layout>
              </v-form>
          </v-flex>
      </v-layout>
      <v-layout>
          <v-flex xs12 sm6>
            <v-card class="mt-3">
                <v-toolbar color="teal" dark>
                    <v-toolbar-title class="text-xs-center">Todos</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon>
                        <v-icon>search</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-list>
                  <v-subheader> Recent Todos </v-subheader>
                    <v-list-tile avatar v-for="(todo, index) in todoList">
                        <v-list-tile-content>
                            <v-list-tile-title>
                                {{ todo.todo }}
                            </v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-checkbox v-model="todo.checked"></v-checkbox>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>
            </v-card>
          </v-flex>
      </v-layout>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
    created() {
        this.getAllTodosForUser();
    },
    data: () => ({
        todo: '',
    }),
    computed: {
        ...mapGetters({
            loading: 'getLoading',
        }),
        ...mapState(['todoList']),
    },
    methods: {
        submitTodo() {
            this.submitTodoToFirebase({
                todo: this.todo,
                checked: false,
            })
                .then(() => this.todo = '');
        },
        ...mapActions([
            'submitTodoToFirebase',
            'getAllTodosForUser',
        ]),
    },
};
</script>
