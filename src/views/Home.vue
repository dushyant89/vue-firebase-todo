<template>
    <div>
        <v-layout row>
            <v-flex xs12 sm6>
                <v-form>
                    <v-layout row>
                        <v-text-field
                            v-model="newTodo"
                            label="Your new todo"
                            hint="I will get better at work"
                            required>
                        </v-text-field>
                        <v-btn
                            color="success"
                            :loading="newTodoLoading"
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
                    <v-toolbar color="light-green" dark>
                        <v-toolbar-title class="text-xs-center">Todos</v-toolbar-title>
                    </v-toolbar>
                    <template v-if="getAllTodosLoading">
                        <v-progress-linear :indeterminate="true"></v-progress-linear>
                    </template>
                    <template v-else>
                        <v-list>
                            <v-subheader class="headline"> Marked </v-subheader>
                            <template v-if="markedTodos.length">
                                <v-list-tile
                                    class="pl-2"
                                    :key="item.todoId"
                                    v-for="item in markedTodos">
                                    <v-list-tile-content>
                                        <v-list-tile-title>
                                            {{ item.todo }}
                                        </v-list-tile-title>
                                    </v-list-tile-content>
                                    <v-list-tile-action>
                                        <v-btn
                                                @click="deleteTodo(item)"
                                                :loading="deleteTodoLoading" flat icon>
                                            <v-icon>delete_outline</v-icon>
                                        </v-btn>
                                    </v-list-tile-action>
                                </v-list-tile>
                            </template>
                            <template v-else>
                                <v-list-tile class="pl-2">
                                    <v-list-tile-content>
                                        <v-alert :value="true" outline color="warning" icon="info">
                                            No marked todos
                                        </v-alert>
                                    </v-list-tile-content>
                                </v-list-tile>
                            </template>
                        </v-list>
                        <v-divider></v-divider>
                        <v-list>
                            <v-subheader class="headline"> Recent </v-subheader>
                                <template v-if="uncheckedTodos.length">
                                    <v-list-tile
                                        class="pl-2"
                                        :key="item.todoId"
                                        v-for="item in uncheckedTodos">
                                        <v-list-tile-content>
                                            <v-list-tile-title>
                                                {{ item.todo }}
                                            </v-list-tile-title>
                                        </v-list-tile-content>
                                        <v-list-tile-action>
                                            <v-checkbox v-model="item.checked"></v-checkbox>
                                        </v-list-tile-action>
                                    </v-list-tile>
                                </template>
                                <template v-else>
                                    <v-list-tile>
                                        <v-list-tile-content>
                                            <v-alert :value="true" outline color="warning" icon="info">
                                                No recent todos
                                            </v-alert>
                                        </v-list-tile-content>
                                    </v-list-tile>
                                </template>
                        </v-list>
                    </template>
                    <v-card-actions>
                        <v-btn
                            @click="markAsDone"
                            :disabled="checkedTodos.length < 1"
                            :loading="markTodosAsDoneLoading"
                            color="success">
                            Mark {{ checkedTodos.length > 0 ? checkedTodos.length: '' }} as done
                        </v-btn>
                    </v-card-actions>
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
        newTodo: '',
    }),
    computed: {
        checkedTodos() {
            return this.uncheckedTodos.filter(todo => todo.checked);
        },
        ...mapGetters({
            newTodoLoading: 'newTodoLoading',
            markTodosAsDoneLoading: 'markTodosAsDoneLoading',
            getAllTodosLoading: 'getAllTodosLoading',
            uncheckedTodos: 'getUnCheckedTodos',
            markedTodos: 'getTodosMarkedAsDone',
        }),
        ...mapState({
            deleteTodoLoading: state => state.loadings.deletingTodo,
        }),
    },
    methods: {
        submitTodo() {
            this.submitTodoToFirebase({
                todo: this.newTodo,
                checked: false,
            })
                .then(() => {
                    this.newTodo = '';
                });
        },
        markAsDone() {
            this.markTodosAsDone(this.checkedTodos);
        },
        ...mapActions([
            'submitTodoToFirebase',
            'getAllTodosForUser',
            'markTodosAsDone',
            'deleteTodo',
        ]),
    },
};
</script>
