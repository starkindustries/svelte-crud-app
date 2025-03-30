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

<div class="app">
	<div class="notes-container">
		{#each $todos as todo}
			<div class="note">
				<textarea
					value={todo.note}
					on:input={(e) => updateNote(todo.id, (e.target as HTMLTextAreaElement).value)}
					placeholder="Write your note here..."
					rows="5"
				></textarea>
				<div class="note-actions">
					<button on:click={() => deleteTodo(todo.id)}>Delete</button>
				</div>
			</div>
		{/each}
	</div>

	<!-- Floating Action Button -->
	<button class="fab" on:click={addNote} aria-label="Add new note">
		+
	</button>
</div>

<style>
	.app {
		min-height: 100vh;
		padding: 0rem;
		background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
		color: white;
	}

	.notes-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.note {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		backdrop-filter: blur(10px);
	}

	textarea {
		width: 100%;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: white;
		padding: 0.5rem;
		border-radius: 4px;
		font-size: 1rem;
	}

	textarea::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}

	.note-actions {
		margin-top: 0.5rem;
	}

	button {
		padding: 0.5rem 1rem;
		background: rgba(255, 255, 255, 0.1);
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
	}

	button:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.fab {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		width: 3.5rem;
		height: 3.5rem;
		background: #3b82f6;
		color: white;
		border: none;
		border-radius: 50%;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.fab:hover {
		background: #2563eb;
		transform: scale(1.1);
	}
</style>
