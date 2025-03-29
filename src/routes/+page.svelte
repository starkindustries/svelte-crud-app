<script lang="ts">
	import { todos, type Todo } from '$lib/stores/todos';
	import { v4 as uuid } from 'uuid';

	function addNote() {
		const newNote: Todo = {
			id: uuid(),
			note: '',
			createdAt: new Date().toISOString()
		};
		todos.update((t) => [newNote, ...t]);
	}

	function deleteTodo(id: string) {
		todos.update((t) => t.filter((todo) => todo.id !== id));
	}

	function updateNote(id: string, note: string) {
		todos.update((t) =>
			t.map((todo) =>
				todo.id === id ? { ...todo, note } : todo
			)
		);
	}
</script>

<div>
	<h1>Notes App</h1>

	<button on:click={addNote}>Add New Note</button>

	<div>
		{#each $todos as todo}
			<div>
				<textarea
					value={todo.note}
					on:input={(e) => updateNote(todo.id, (e.target as HTMLTextAreaElement).value)}
					placeholder="Write your note here..."
					rows="5"
				></textarea>
				<div>
					<button on:click={() => deleteTodo(todo.id)}>Delete</button>
				</div>
			</div>
		{/each}
	</div>
</div>
