<script lang="ts">
	import { themeStore } from '$lib/theme/store';
	import { authStore } from '$lib/auth/store.svelte';
	import { resolveRoute } from '$app/paths';
	import logo from '$lib/assets/logo.png';
	import type { Snippet } from 'svelte';

	interface Props {
		sidebar: Snippet;
		children: Snippet;
	}

	let { sidebar, children }: Props = $props();

	const { user, isAuthenticated } = authStore;

	let isSidebarOpen = $state(true);
	let isThemeOpen = $state(false);

	const themeOptions = [
		{ value: 'light' as const, label: '☀️ Light' },
		{ value: 'dark' as const, label: '🌙 Dark' },
		{ value: 'system' as const, label: '⚙️ System' }
	];

	function toggleSidebar() {
		isSidebarOpen = !isSidebarOpen;
	}

	function handleThemeSelect(theme: (typeof themeOptions)[0]['value']) {
		themeStore.setTheme(theme);
		isThemeOpen = false;
	}

	function handleGitHubSignIn() {
		window.location.href = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID || ''}&redirect_uri=${encodeURIComponent(`${window.location.origin}/auth/github/callback`)}&scope=user:email`;
	}

	function handleSignOut() {
		authStore.logout();
	}
</script>

<div class="flex h-screen flex-col bg-white dark:bg-gray-950">
	<!-- Top Navigation Bar -->
	<nav
		class="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900"
	>
		<!-- Left: Logo and Brand -->
		<div class="flex items-center gap-3">
			<button
				type="button"
				onclick={toggleSidebar}
				class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
				aria-label="Toggle sidebar"
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>
			<a href={resolveRoute('/')} class="flex items-center gap-2">
				<img src={logo} alt="breakspace" class="h-8 w-8" />
				<span class="hidden font-bold text-gray-900 dark:text-white sm:inline">breakspace</span>
			</a>
		</div>

		<!-- Right: Theme Toggle and Auth -->
		<div class="flex items-center gap-2">
			<!-- Theme Selector -->
			<div class="relative">
				<button
					type="button"
					onclick={() => (isThemeOpen = !isThemeOpen)}
					class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
					aria-label="Toggle theme"
				>
					{#if $themeStore === 'light'}
						☀️
					{:else if $themeStore === 'dark'}
						🌙
					{:else}
						⚙️
					{/if}
				</button>

				{#if isThemeOpen}
					<div
						class="absolute right-0 top-full mt-1 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
					>
						{#each themeOptions as option (option.value)}
							<button
								type="button"
								class="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 {$themeStore ===
								option.value
									? 'bg-brand-50 dark:bg-brand-900/20'
									: ''}"
								onclick={() => handleThemeSelect(option.value)}
							>
								{option.label}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Auth -->
			{#if isAuthenticated}
				<div class="flex items-center gap-2">
					<img src={user?.image} alt={user?.name} class="h-8 w-8 rounded-full" />
					<button
						type="button"
						onclick={handleSignOut}
						class="rounded px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
					>
						Sign out
					</button>
				</div>
			{:else}
				<button
					type="button"
					onclick={handleGitHubSignIn}
					class="flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-700"
				>
					<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.544 2.914 1.186.092-.921.349-1.544.635-1.9-2.22-.253-4.555-1.112-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.270.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.817c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.195 20 14.44 20 10.017 20 4.484 15.522 0 10 0z"
							clip-rule="evenodd"
						/>
					</svg>
					<span class="hidden sm:inline">Sign in</span>
				</button>
			{/if}
		</div>
	</nav>

	<!-- Main Content Area -->
	<div class="flex flex-1 overflow-hidden">
		<!-- Sidebar -->
		{#if isSidebarOpen}
			<aside
				class="w-56 border-r border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900"
			>
				{@render sidebar()}
			</aside>
		{/if}

		<!-- Content -->
		<main class="flex-1 overflow-auto">
			{@render children()}
		</main>
	</div>
</div>

<style>
	:global(html.dark) {
		color-scheme: dark;
	}
</style>
