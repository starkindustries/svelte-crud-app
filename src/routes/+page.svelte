<script lang="ts">
	import { todos, type Todo } from '$lib/stores/todos';
	import { v4 as uuid } from 'uuid';
	let title = '';
	let editingId: string | null = null;
	let editedTitle = '';

	function addTodo() {
		if (!title) return;
		const newTodo: Todo = {
			id: uuid(),
			title,
			createdAt: new Date().toISOString()
		};
		todos.update((t) => [...t, newTodo]);
		title = '';
	}

	function startEdit(todo: Todo) {
		editingId = todo.id;
		editedTitle = todo.title;
	}

	function saveEdit(id: string) {
		todos.update((t) => t.map((todo) => (todo.id === id ? { ...todo, title: editedTitle } : todo)));
		editingId = null;
	}

	function deleteTodo(id: string) {
		todos.update((t) => t.filter((todo) => todo.id !== id));

		// Line above explained:
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
	}
</script>


<!-- page contents  -->
<h1>Welcome to SvelteKit: TODO list</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>


<form on:submit|preventDefault={addTodo}>
	<input bind:value={title} placeholder="Enter TODO title" required />
	<button type="submit">Add TODO</button>
</form>

<ul>
	{#each $todos as todo}
		<li>
			{#if editingId === todo.id}
				<input bind:value={editedTitle} />
				<button on:click={() => saveEdit(todo.id)}>Save</button>
			{:else}
				{todo.title}
				<button on:click={() => startEdit(todo)}>Edit</button>
				<button on:click={() => deleteTodo(todo.id)}>Delete</button>
			{/if}
		</li>
	{/each}
</ul>
