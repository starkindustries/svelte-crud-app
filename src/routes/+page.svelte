<script lang="ts">
	import { todos, type Todo } from '$lib/stores/todos';
	import { v4 as uuid } from 'uuid';
	import { goto } from '$app/navigation';

	let textareas: { [key: string]: HTMLTextAreaElement } = {};
	let focusedNoteId: string | null = null;
	let openMenuId: string | null = null;
	let searchQuery = '';
	let isMenuOpen = false;

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
		delete textareas[id];
		todos.update((t) => t.filter((todo) => todo.id !== id));
	}

	function updateNote(id: string, note: string) {
		console.log('Updating note:', id, note);
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

	function handleShare(e: MouseEvent, id: string) {
		e.preventDefault();
		e.stopPropagation();
		console.log('Sharing note:', id);
		openMenuId = null;
	}

	function handleMakeCopy(e: MouseEvent, id: string) {
		e.preventDefault();
		e.stopPropagation();
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

	function handleSearch(e: Event) {
		const query = (e.target as HTMLInputElement).value;
		console.log('Searching for:', query);
	}

	function handleHamburgerClick() {
		isMenuOpen = true;
	}

	function closeMenu() {
		isMenuOpen = false;
	}

	function handleProfileClick() {
		console.log('Profile clicked');
	}

	function handleMenuItemClick(item: string) {
		if (item === 'Reports') {
			goto('/reports');
		} else {
			console.log(`Menu item clicked: ${item}`);
		}
		closeMenu();
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="app">
	{#if isMenuOpen}
		<div class="menu-overlay" on:click={closeMenu} />
	{/if}

	<div class="sliding-menu" class:open={isMenuOpen}>
		<div class="menu-header">
			<h2>Menu</h2>
		</div>
		<nav>
			<ul>
				<li><button on:click={() => handleMenuItemClick('Reports')}>Reports</button></li>
				<li><button on:click={() => handleMenuItemClick('Settings')}>Settings</button></li>
				<li><button on:click={() => handleMenuItemClick('About')}>About</button></li>
			</ul>
		</nav>
	</div>

	<div class="top-bar">
		<button class="icon-button" on:click={handleHamburgerClick} aria-label="Menu">
			☰
		</button>
		<input
			type="text"
			class="search-bar"
			placeholder="Search notes..."
			bind:value={searchQuery}
			on:input={handleSearch}
		/>
		<button class="icon-button" on:click={handleProfileClick} aria-label="Profile">
			○
		</button>
	</div>

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
								<button
									on:click={(e) => handleShare(e, todo.id)}
									on:mousedown|preventDefault
								>
									Share
								</button>
								<button
									on:click={(e) => handleMakeCopy(e, todo.id)}
									on:mousedown|preventDefault
								>
									Make Copy
								</button>
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
		font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
	}

	.top-bar {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: rgba(30, 30, 30, 0.95);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.icon-button {
		background: none;
		border: none;
		color: rgba(255, 255, 255, 0.7);
		font-size: 1.5rem;
		padding: 0.5rem;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 2.5rem;
	}

	.icon-button:hover {
		color: white;
	}

	.search-bar {
		flex: 1;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 4px;
		color: white;
		padding: 0.5rem;
		font-size: 1rem;
		font-family: inherit;
	}

	.search-bar::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}

	.search-bar:focus {
		outline: none;
		border-color: rgba(255, 255, 255, 0.2);
	}

	.notes-container {
		padding: 1rem;
	}

	.notes-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.note {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 0;
		backdrop-filter: blur(10px);
		position: relative;
	}

	textarea {
		width: 100%;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: white;
		padding: 0.5rem;
		border-radius: 0;
		font-size: 1rem;
		min-height: 2.5rem;
		resize: none;
		overflow: hidden;
		font-family: inherit;
	}

	textarea::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}

	.menu-container {
		position: absolute;
		top: 0.5rem;
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
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 2.5rem;
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
		min-width: 150px;
		animation: slideUp 0.2s ease-out;
		white-space: nowrap;
		font-family: inherit;
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
		white-space: nowrap;
		font-family: inherit;
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

	.menu-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(2px);
		z-index: 998;
	}

	.sliding-menu {
		position: fixed;
		top: 0;
		left: -80%;
		width: 80%;
		height: 100%;
		background: rgba(30, 30, 30, 0.98);
		backdrop-filter: blur(10px);
		z-index: 999;
		transition: left 0.3s ease-in-out;
		border-right: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		flex-direction: column;
	}

	.sliding-menu.open {
		left: 0;
	}

	.menu-header {
		display: flex;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.menu-header h2 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: normal;
	}

	.sliding-menu nav {
		flex: 1;
		padding: 1rem;
	}

	.sliding-menu ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.sliding-menu li {
		margin-bottom: 0.5rem;
	}

	.sliding-menu li button {
		width: 100%;
		text-align: left;
		padding: 0.75rem 1rem;
		background: none;
		border: none;
		color: white;
		font-size: 1rem;
		cursor: pointer;
		border-radius: 4px;
		transition: all 0.2s;
	}

	.sliding-menu li button:hover {
		background: rgba(255, 255, 255, 0.1);
	}
</style>
