import { writable } from 'svelte/store';

// Define the shape of a Note item using a TypeScript type
export type Note = {
    id: string;
    content: string;
    createdAt: string;
};

// Check if localStorage is available (important for SSR environments like SvelteKit)
const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('notes') : null;

// Parse stored JSON or start with an empty array if nothing is stored
const initial: Note[] = stored ? JSON.parse(stored) : [];

// Create a writable Svelte store initialized with the existing Notes
export const notes = writable<Note[]>(initial);

// Whenever the store changes, persist the new state to localStorage
notes.subscribe((value) => {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('notes', JSON.stringify(value));
    }
});
