import { writable } from 'svelte/store';

export interface AuthUser {
	id: string;
	email: string | null;
	name: string;
	image: string | null;
	login: string;
}

export interface AuthSession {
	user: AuthUser;
	accessToken: string;
	createdAt: number;
}

const STORAGE_KEY = 'break-space-auth-session';

function createAuthStore() {
	let session = $state<AuthSession | null>(null);

	// Load from localStorage on initialization
	if (typeof window !== 'undefined') {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				session = JSON.parse(stored);
			} catch (e) {
				console.error('Failed to parse stored session:', e);
			}
		}
	}

	return {
		get session() {
			return session;
		},
		get user() {
			return session?.user ?? null;
		},
		get isAuthenticated() {
			return session !== null;
		},

		setSession(newSession: AuthSession | null) {
			session = newSession;
			if (typeof window !== 'undefined') {
				if (newSession) {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
				} else {
					localStorage.removeItem(STORAGE_KEY);
				}
			}
		},

		logout() {
			this.setSession(null);
		}
	};
}

export const authStore = createAuthStore();
