<script lang="ts">
	import { todos, type Todo } from '$lib/stores/todos';
	import { v4 as uuid } from 'uuid';
	let title = '';
	let editingId: string | null = null;
	let editedTitle = '';
	let editedNote = '';

	function addTodo() {
		if (!title) return;
		const newTodo: Todo = {
			id: uuid(),
			title,
			note: '',
			createdAt: new Date().toISOString()
		};
		todos.update((t) => [...t, newTodo]);
		title = '';
	}

	function startEdit(todo: Todo) {
		editingId = todo.id;
		editedTitle = todo.title;
		editedNote = todo.note;
	}

	function saveEdit(id: string) {
		todos.update((t) =>
			t.map((todo) =>
				todo.id === id ? { ...todo, title: editedTitle, note: editedNote } : todo
			)
		);
		editingId = null;
	}

	function deleteTodo(id: string) {
		// Line below explained:
		// todos.update((t) =>        // Access the current list of TODOs (`t`)
		//     t.filter((todo) =>     // Create a new list by filtering the old one
		//         todo.id !== id     // Keep only TODOs whose id does NOT match the one to delete
		//     )                      // Result: the TODO with the matching id is removed
		// );                         // The store is updated with this new filtered list

		// Here is the line above again, this time rewritten verbosely:
		// todos.update(function (t) {
		//     return t.filter(function (todo) {
		//         return todo.id !== id;
		// 	   });
		// });

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

	<form on:submit|preventDefault={addTodo}>
		<input
			bind:value={title}
			placeholder="Enter note title"
			required
		/>
		<button type="submit">Add Note</button>
	</form>

	<div>
		{#each $todos as todo}
			<div>
				{#if editingId === todo.id}
					<div>
						<input
							bind:value={editedTitle}
							placeholder="Note title"
						/>
						<textarea
							bind:value={editedNote}
							placeholder="Write your note here..."
							rows="5"
						></textarea>
						<button on:click={() => saveEdit(todo.id)}>Save</button>
					</div>
				{:else}
					<div>
						<h2>{todo.title}</h2>
						<textarea
							value={todo.note}
							on:input={(e) => updateNote(todo.id, (e.target as HTMLTextAreaElement).value)}
							placeholder="Write your note here..."
							rows="5"
						></textarea>
						<div>
							<button on:click={() => startEdit(todo)}>Edit Title</button>
							<button on:click={() => deleteTodo(todo.id)}>Delete</button>
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
