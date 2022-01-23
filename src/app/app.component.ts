import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { delay } from 'rxjs/operators';
import { Todo, TodosService } from './todos.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	todos: Todo[] = [];
	loading: boolean = false;
	todoTitle: string = '';
	error: string = '';

	constructor(private todosService: TodosService) { }

	ngOnInit() {
		this.fetchTodos();
	}

	addTodo(): void {
		this.loading = true;
		if (!this.todoTitle.trim()) {
			return;
		}
		const newTodo: Todo = {
			title: this.todoTitle,
			completed: false
		}

		this.todosService.addTodo(newTodo)
			.subscribe(todo => {
				this.todos.push(todo);
				this.todoTitle = '';
				this.loading = false;
			});

	}

	fetchTodos(): void {
		this.loading = true;
		this.todosService.fetchTodos()
			.subscribe(todos => {
				this.todos = todos;
				this.loading = false;
			}, error => {
				this.error = error.message;
			});
	}

	removeTodo(id: number): void {
		this.loading = true;
		this.todosService.removeTodo(id)
			.subscribe(() => {
				this.todos = this.todos.filter(t => t.id !== id);
				this.loading = false;
			}, error => {
				this.error = error.message;
			});
	}

	completeTodo(id: number): void {
		this.loading = true;
		this.todosService.completeTodo(id).subscribe(todo => {
			this.todos.find(t => t.id === todo.id).completed = true;
			this.loading = false;
		}, error => {
			this.error = error.message;
		})
	}
}

