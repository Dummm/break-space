<script lang="ts">
	import { authStore } from '$lib/auth/store.svelte';
	import { goto } from '$app/navigation';

	const { user, isAuthenticated } = authStore;

	function handleSignOut() {
		authStore.logout();
		goto('/demo/better-auth/login');
	}
</script>

{#if isAuthenticated && user}
	<div class="max-w-md mx-auto p-4">
		{#if user.image}
			<img src={user.image} alt={user.name} class="w-16 h-16 rounded-full mb-4" />
		{/if}
		<h1>Hi, {user.name}!</h1>
		<p class="text-gray-600">@{user.login}</p>
		{#if user.email}
			<p class="text-gray-600">{user.email}</p>
		{/if}
		<p class="text-sm text-gray-500 mt-4">User ID: {user.id}</p>

		<button
			onclick={handleSignOut}
			class="mt-6 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
		>
			Sign out
		</button>
	</div>
{:else}
	<div class="max-w-md mx-auto p-4">
		<p class="text-gray-600">Not authenticated.</p>
		<a href="/demo/better-auth/login" class="text-blue-600 underline">Go to login</a>
	</div>
{/if}
