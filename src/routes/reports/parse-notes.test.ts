import { todos } from '$lib/stores/todos';
import { get } from 'svelte/store';
import { describe, it, expect, test } from 'vitest';
import { parseNote } from './parse-notes';

describe('Parse Test Suite', () => {
    it('should pass a basic test', () => {
        console.log('todos', get(todos));
        expect(true).toBe(true);
    });

    it('should add numbers correctly', () => {
        expect(1 + 1).toBe(2);
    });
});


test('adds numbers correctly', () => {
    expect(1 + 1).toBe(2);
});

test('parse todo data', () => {
    const note = `2024-05-15 20:39 PDT

Overhead Press
115 x 8
110 x 7

Deadlift
315 x 3
305 x 2

Barbell Row
155 x 10
150 x 9

Pull-Up
Bodyweight x 8
Bodyweight x 8
Bodyweight x 8

Bench Press
155 x 10
150 x 9
`;

    const parsed = parseNote(note);
    console.log('parsed', parsed);
    expect(true).toBe(true);
});
