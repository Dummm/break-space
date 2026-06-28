<script lang="ts">
	import { authStore } from '$lib/auth/store.svelte';
	import { resolveRoute } from '$app/paths';

	const { user, isAuthenticated } = authStore;
</script>

<div class="mx-auto max-w-4xl px-6 py-12">
	<div class="space-y-8">
		<!-- Header -->
		<div class="space-y-4">
			<h1 class="text-4xl font-bold text-gray-900 dark:text-white">
				Welcome to <span class="text-brand-600 dark:text-brand-400">breakspace</span>
			</h1>
			<p class="text-lg text-gray-600 dark:text-gray-400">
				A static-first web workspace where you own your data.
			</p>
		</div>

		<!-- Status -->
		<div
			class="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900"
		>
			<h2 class="mb-4 text-lg font-semibold">Current Status</h2>
			<div class="space-y-2 text-sm">
				<div class="flex items-center gap-2">
					<span class="text-lg">✓</span>
					<span class="text-gray-700 dark:text-gray-300">GitHub OAuth PoC - Working</span>
				</div>
				<div class="flex items-center gap-2">
					<span class="text-lg">✓</span>
					<span class="text-gray-700 dark:text-gray-300">Static-first architecture</span>
				</div>
				<div class="flex items-center gap-2">
					<span class="text-lg">✓</span>
					<span class="text-gray-700 dark:text-gray-300">Client-side session management</span>
				</div>
			</div>
		</div>

		<!-- Auth Status -->
		{#if isAuthenticated}
			<div
				class="rounded-lg border border-brand-200 bg-brand-50 p-6 dark:border-brand-900/30 dark:bg-brand-900/10"
			>
				<div class="space-y-4">
					<div class="flex items-center gap-3">
						<img src={user?.image} alt={user?.name} class="h-12 w-12 rounded-full" />
						<div>
							<p class="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
							<p class="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
						</div>
					</div>
					<p class="text-sm text-gray-600 dark:text-gray-400">
						You're signed in with GitHub. Your session is stored locally in this browser.
					</p>
				</div>
			</div>
		{:else}
			<div
				class="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900"
			>
				<p class="mb-4 text-gray-700 dark:text-gray-300">
					Sign in with GitHub to try the authentication PoC. Use the button in the top right.
				</p>
			</div>
		{/if}

		<!-- Next Steps -->
		<div class="space-y-4">
			<h2 class="text-lg font-semibold">Next Steps</h2>
			<div class="grid gap-4 md:grid-cols-2">
				<a
					href={resolveRoute('/demo/better-auth/login')}
					class="rounded-lg border border-gray-200 p-4 transition-all hover:border-brand-400 hover:bg-brand-50 dark:border-gray-800 dark:hover:border-brand-600 dark:hover:bg-brand-950/20"
				>
					<h3 class="font-semibold text-gray-900 dark:text-white">🔐 View Auth Demo</h3>
					<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
						Detailed GitHub authentication flow and session info.
					</p>
				</a>

				<div
					class="rounded-lg border border-gray-200 p-4 opacity-50 transition-all dark:border-gray-800"
					title="Coming in Phase 1"
				>
					<h3 class="font-semibold text-gray-900 dark:text-white">💾 Storage Providers</h3>
					<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
						Coming in Phase 1 - Connect to GitHub, GitLab, Google Drive, etc.
					</p>
				</div>

				<div
					class="rounded-lg border border-gray-200 p-4 opacity-50 transition-all dark:border-gray-800"
					title="Coming in Phase 2"
				>
					<h3 class="font-semibold text-gray-900 dark:text-white">📁 Workspaces</h3>
					<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
						Coming in Phase 2 - Organize and manage multiple workspaces.
					</p>
				</div>

				<div
					class="rounded-lg border border-gray-200 p-4 opacity-50 transition-all dark:border-gray-800"
					title="Coming in Phase 3"
				>
					<h3 class="font-semibold text-gray-900 dark:text-white">🔄 Sync Engine</h3>
					<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
						Coming in Phase 3 - Offline-first synchronization.
					</p>
				</div>
			</div>
		</div>

		<!-- Features -->
		<div class="space-y-4">
			<h2 class="text-lg font-semibold">Core Features</h2>
			<ul class="space-y-2 text-gray-700 dark:text-gray-300">
				<li class="flex items-start gap-3">
					<span class="mt-1 text-brand-600 dark:text-brand-400">→</span>
					<span><strong>Static-First:</strong> Deployable without a backend server</span>
				</li>
				<li class="flex items-start gap-3">
					<span class="mt-1 text-brand-600 dark:text-brand-400">→</span>
					<span><strong>Privacy-Focused:</strong> Your data stays with you</span>
				</li>
				<li class="flex items-start gap-3">
					<span class="mt-1 text-brand-600 dark:text-brand-400">→</span>
					<span><strong>Vendor-Neutral:</strong> Switch storage providers anytime</span>
				</li>
				<li class="flex items-start gap-3">
					<span class="mt-1 text-brand-600 dark:text-brand-400">→</span>
					<span><strong>Offline-First:</strong> Works without internet</span>
				</li>
			</ul>
		</div>
	</div>
</div>
