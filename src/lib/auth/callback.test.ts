import { describe, expect, it } from 'vitest';
import { buildCallbackUrl } from './callback';

describe('buildCallbackUrl', () => {
	it('creates an absolute callback URL from a relative path', () => {
		expect(buildCallbackUrl('http://localhost:5173', '/demo/better-auth')).toBe(
			'http://localhost:5173/demo/better-auth'
		);
	});

	it('returns the provided absolute URL unchanged', () => {
		expect(buildCallbackUrl('https://example.com', 'https://example.com/dashboard')).toBe(
			'https://example.com/dashboard'
		);
	});
});
