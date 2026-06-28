<script lang="ts">
	import { page } from '$app/state';

	interface NavItem {
		label: string;
		href: string;
		icon: string;
		badge?: string;
	}

	const navItems: NavItem[] = [
		{
			label: 'Home',
			href: '/',
			icon: '🏠'
		},
		{
			label: 'Demo - Auth',
			href: '/demo/better-auth/login',
			icon: '🔐',
			badge: 'PoC'
		},
		{
			label: 'Workspaces',
			href: '/demo/workspaces',
			icon: '📁'
		},
		{
			label: 'Storage',
			href: '/demo/storage',
			icon: '💾'
		}
	];

	function isActive(href: string): boolean {
		return page.url.pathname === href;
	}
</script>

<div class="space-y-1">
	<div class="mb-6 pb-4">
		<h2 class="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">Navigation</h2>
	</div>

	<nav class="space-y-1">
		{#each navItems as item (item.href)}
			<a
				href={item.href}
				class="group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors {isActive(
					item.href
				)
					? 'bg-brand-100 text-brand-900 dark:bg-brand-900/30 dark:text-brand-300'
					: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}"
			>
				<span class="flex items-center gap-2">
					<span>{item.icon}</span>
					<span>{item.label}</span>
				</span>
				{#if item.badge}
					<span
						class="inline-block rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white"
					>
						{item.badge}
					</span>
				{/if}
			</a>
		{/each}
	</nav>

	<hr class="my-4 border-gray-200 dark:border-gray-800" />

	<div class="mb-2">
		<h3 class="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">Phases</h3>
	</div>

	<div class="space-y-1 text-sm">
		<div
			class="group flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-400"
		>
			<span>✓</span>
			<span>GitHub Auth</span>
		</div>
		<div
			class="group flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 dark:text-gray-500"
		>
			<span>→</span>
			<span>Storage Adapters</span>
		</div>
		<div
			class="group flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 dark:text-gray-500"
		>
			<span>→</span>
			<span>Workspaces</span>
		</div>
	</div>
</div>
