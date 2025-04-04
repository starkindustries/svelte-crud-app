import { describe, it, expect } from 'vitest';

describe('Hello World Test Suite', () => {
  it('should pass a basic test', () => {
    expect(true).toBe(true);
  });

  it('should add numbers correctly', () => {
    expect(1 + 1).toBe(2);
  });
});