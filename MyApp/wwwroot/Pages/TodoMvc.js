import { reactive } from 'vue'
import { client } from "../js/default.mjs"
import { Todo, QueryTodos, CreateTodo, UpdateTodo, DeleteTodos } from "../js/dtos.mjs"

/**@param {Todo[]} todos */
export default function (todos) {
    return reactive({
        todos,
        newTodo: '',
        filter: 'all',
        error: null,
        finishedTodos() {
            return this.todos.filter(x => x.isFinished)
        },
        unfinishedTodos() {
            return this.todos.filter(x => !x.isFinished)
        },
        filteredTodos() {
            return this.filter === 'finished'
                ? this.finishedTodos()
                : this.filter === 'unfinished'
                    ? this.unfinishedTodos()
                    : this.todos
        },
        async refreshTodos(errorStatus) {
            this.error = errorStatus
            let api = await client.api(new QueryTodos())
            if (api.succeeded) {
                this.todos = api.response.results
            }
        },
        async addTodo() {
            this.todos.push(new Todo({text: this.newTodo}))
            let api = await client.api(new CreateTodo({text: this.newTodo}))
            if (api.succeeded)
                this.newTodo = ''
            return this.refreshTodos(api.error)
        },
        async removeTodo(id) {
            this.todos = this.todos.filter(x => x.id !== id)
            let api = await client.api(new DeleteTodos({ids: [id]}))
            await this.refreshTodos(api.error)
        },
        async removeFinishedTodos() {
            let ids = this.todos.filter(x => x.isFinished).map(x => x.id)
            if (ids.length === 0) return
            this.todos = this.todos.filter(x => !x.isFinished)
            let api = await client.api(new DeleteTodos({ids}))
            await this.refreshTodos(api.error)
        },
        async toggleTodo(id) {
            const todo = this.todos.find(x => x.id === id)
            todo.isFinished = !todo.isFinished
            let api = await client.api(new UpdateTodo(todo))
            await this.refreshTodos(api.error)
        },
        changeFilter(filter) {
            this.filter = filter
        }
    })
}