<script lang="ts">
	import { authStore } from '$lib/auth/store.svelte.ts';
	import { goto } from '$app/navigation';

	let isLoading = $state(false);
	let error = $state('');

	async function handleGitHubSignIn() {
		isLoading = true;
		error = '';

		try {
			const clientId = 'Ov23li0B4UAT3ELo6jOU'; // From your .env
			const redirectUri = `${window.location.origin}/auth/github/callback`;
			const state = Math.random().toString(36).substring(7);

			// Store state for verification
			sessionStorage.setItem('oauth-state', state);

			// Redirect to GitHub OAuth
			window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email&state=${state}`;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to initiate sign-in';
			isLoading = false;
		}
	}
</script>

<h1>Sign in</h1>

<button
	onclick={handleGitHubSignIn}
	disabled={isLoading}
	class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
>
	{isLoading ? 'Signing in...' : 'Sign in with GitHub'}
</button>

{#if error}
	<p class="text-red-500 mt-2">{error}</p>
{/if}
