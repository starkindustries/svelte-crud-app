<script lang="ts">
	import { todos, type Todo } from '$lib/stores/todos';
	import { v4 as uuid } from 'uuid';

	let textareas: { [key: string]: HTMLTextAreaElement } = {};
	let focusedNoteId: string | null = null;

	function autoResize(textarea: HTMLTextAreaElement) {
		textarea.style.height = 'auto';
		textarea.style.height = textarea.scrollHeight + 'px';
	}

	function handleInput(e: Event, id: string) {
		const textarea = e.target as HTMLTextAreaElement;
		updateNote(id, textarea.value);
		autoResize(textarea);
	}

	function addNote() {
		const now = new Date();
		const dateStr = now.toLocaleString('en-US', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
			timeZoneName: 'short'
		}).replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2').replace(',', '');

		const newNote: Todo = {
			id: uuid(),
			note: `${dateStr}\n`,
			createdAt: new Date().toISOString()
		};

		todos.update((t) => [newNote, ...t]);

		// Focus the textarea after a brief delay to ensure it's rendered
		setTimeout(() => {
			const textarea = textareas[newNote.id];
			if (textarea) {
				textarea.focus();
				autoResize(textarea);
			}
		}, 0);
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

	function handleFocus(id: string) {
		focusedNoteId = id;
	}

	function handleBlur() {
		focusedNoteId = null;
	}
</script>

<div class="app">
	<div class="notes-container">
		{#each $todos as todo}
			<div class="note">
				<textarea
					bind:this={textareas[todo.id]}
					value={todo.note}
					on:input={(e) => handleInput(e, todo.id)}
					on:focus={() => handleFocus(todo.id)}
					on:blur={handleBlur}
					placeholder="Write your note here..."
					rows="1"
				></textarea>
				{#if focusedNoteId === todo.id}
					<button class="menu-button" on:click={() => deleteTodo(todo.id)} aria-label="Delete note">
						⋮
					</button>
				{/if}
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
		position: relative;
	}

	textarea {
		width: 100%;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: white;
		padding: 0.5rem;
		border-radius: 4px;
		font-size: 1rem;
		min-height: 2.5rem;
		resize: none;
		overflow: hidden;
	}

	textarea::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}

	.menu-button {
		position: absolute;
		bottom: 0.5rem;
		right: 0.5rem;
		background: none;
		border: none;
		color: rgba(255, 255, 255, 0.5);
		font-size: 1.2rem;
		padding: 0.25rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.menu-button:hover {
		color: white;
		transform: scale(1.1);
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
