import { createAuthClient } from 'better-auth/client';

// Client-side only auth using Better Auth
// Sessions stored in browser cookies/localStorage
export const client = createAuthClient({
	baseURL: typeof window !== 'undefined' ? window.location.origin : '',
	plugins: []
});

export const { signIn, signOut, useSession, getSession } = client;
