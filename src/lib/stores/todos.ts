import { writable } from 'svelte/store';

// Define the shape of a TODO item using a TypeScript type
export type Todo = {
    id: string; // unique ID for updates
    title: string;
    createdAt: string;
};

// Check if localStorage is available (important for SSR environments like SvelteKit)
const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('todos') : null;

// Parse stored JSON or start with an empty array if nothing is stored
const initial: Todo[] = stored ? JSON.parse(stored) : [];

// Create a writable Svelte store initialized with the existing TODOs
export const todos = writable<Todo[]>(initial);

// Whenever the store changes, persist the new state to localStorage
todos.subscribe((value) => {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('todos', JSON.stringify(value));
    }
});
