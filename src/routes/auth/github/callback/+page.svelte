<script lang="ts">
	import { authStore } from '$lib/auth/store.svelte.ts';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let status = $state<'loading' | 'success' | 'error'>('loading');
	let errorMessage = $state('');

	onMount(async () => {
		try {
			const params = new URLSearchParams(window.location.search);
			const code = params.get('code');
			const state = params.get('state');

			if (!code) {
				throw new Error('No authorization code received from GitHub');
			}

			// Verify state
			const savedState = sessionStorage.getItem('oauth-state');
			if (state !== savedState) {
				throw new Error('State mismatch - possible CSRF attack');
			}

			// Exchange code for user data via our callback endpoint
			const response = await fetch(`/auth/github/callback?code=${encodeURIComponent(code)}`);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Authentication failed');
			}

			// Store session client-side
			authStore.setSession({
				user: data.user,
				accessToken: data.accessToken,
				createdAt: Date.now()
			});

			status = 'success';
			sessionStorage.removeItem('oauth-state');

			// Redirect to authenticated page
			await goto('/demo/better-auth');
		} catch (err) {
			status = 'error';
			errorMessage = err instanceof Error ? err.message : 'Authentication failed';
			console.error('OAuth callback error:', err);
		}
	});
</script>

<div class="max-w-md mx-auto p-4">
	{#if status === 'loading'}
		<p>Authenticating with GitHub...</p>
	{:else if status === 'success'}
		<p class="text-green-600">Authentication successful! Redirecting...</p>
	{:else}
		<p class="text-red-600">Authentication failed: {errorMessage}</p>
		<a href="/demo/better-auth/login" class="text-blue-600 underline mt-4 block">Back to login</a>
	{/if}
</div>
