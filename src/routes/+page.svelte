<script lang="ts">
	import { todos, type Todo } from '$lib/stores/todos';
	import { v4 as uuid } from 'uuid';

	let textareas: { [key: string]: HTMLTextAreaElement } = {};
	let focusedNoteId: string | null = null;
	let openMenuId: string | null = null;

	function autoResize(textarea: HTMLTextAreaElement) {
		textarea.style.height = 'auto';
		textarea.style.height = textarea.scrollHeight + 'px';
	}

	// Reactive statement to handle textarea resizing
	$: {
		// Wait for next tick to ensure textareas are rendered
		setTimeout(() => {
			Object.values(textareas).forEach(autoResize);
		}, 0);
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

	function handleMenuClick(e: MouseEvent, id: string) {
		e.preventDefault();
		e.stopPropagation();
		openMenuId = openMenuId === id ? null : id;
	}

	function handleShare(id: string) {
		console.log('Sharing note:', id);
		openMenuId = null;
	}

	function handleMakeCopy(id: string) {
		console.log('Making copy of note:', id);
		openMenuId = null;
	}

	function handleDelete(e: MouseEvent, id: string) {
		e.preventDefault();
		e.stopPropagation();
		deleteTodo(id);
		openMenuId = null;
	}

	// Close menu when clicking outside
	function handleClickOutside(e: MouseEvent) {
		if (!(e.target as HTMLElement).closest('.menu-container')) {
			openMenuId = null;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

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
					<div class="menu-container">
						<button
							class="menu-button"
							on:click={(e) => handleMenuClick(e, todo.id)}
							on:mousedown|preventDefault
							aria-label="Open menu"
						>
							⋮
						</button>
						{#if openMenuId === todo.id}
							<div class="submenu">
								<button on:click={() => handleShare(todo.id)}>Share</button>
								<button on:click={() => handleMakeCopy(todo.id)}>Make Copy</button>
								<button
									class="delete"
									on:click={(e) => handleDelete(e, todo.id)}
									on:mousedown|preventDefault
								>
									Delete
								</button>
							</div>
						{/if}
					</div>
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

	.menu-container {
		position: absolute;
		bottom: 0.5rem;
		right: 0.5rem;
	}

	.menu-button {
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

	.submenu {
		position: absolute;
		bottom: 100%;
		right: 0;
		background: rgba(30, 30, 30, 0.95);
		border-radius: 8px;
		padding: 0.5rem;
		margin-bottom: 0.5rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(10px);
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		min-width: 120px;
		animation: slideUp 0.2s ease-out;
	}

	.submenu button {
		background: none;
		border: none;
		color: white;
		padding: 0.5rem 1rem;
		text-align: left;
		cursor: pointer;
		border-radius: 4px;
		transition: all 0.2s;
	}

	.submenu button:hover {
		background: rgba(255, 255, 255, 0.1);
	}

	.submenu button.delete {
		color: #ef4444;
	}

	.submenu button.delete:hover {
		background: rgba(239, 68, 68, 0.1);
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
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
