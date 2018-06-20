<template>
  <div>
      <v-form>
        <v-text-field
                v-model="todo"
                label="Todo"
                hint="I will get better at work"
                required
        >

        </v-text-field>
        <v-btn
                color="success"
                :loading="loading"
                @click="submitTodo">
          Submit
          <v-icon>send</v-icon>
        </v-btn>
      </v-form>
      <v-list>
        <v-subheader> Your Todos </v-subheader>
        <v-list-tile v-for="todo in todoList">
          <v-list-tile-content>
            {{ todo.todo }}
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
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
      });
    },
    ...mapActions([
      'submitTodoToFirebase',
      'getAllTodosForUser',
    ]),
  },
};
</script>
