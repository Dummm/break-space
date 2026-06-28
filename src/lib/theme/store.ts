import { writable, derived } from 'svelte/store';

export type Theme = 'light' | 'dark' | 'system';

function createThemeStore() {
	const { subscribe, set } = writable<Theme>('system');

	return {
		subscribe,
		setTheme: (theme: Theme) => {
			set(theme);
			if (typeof window !== 'undefined') {
				localStorage.setItem('theme', theme);
				applyTheme(theme);
			}
		},
		toggleTheme: () => {
			if (typeof window === 'undefined') return;
			const stored = localStorage.getItem('theme') as Theme | null;
			const current =
				stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
			const themes: Theme[] = ['light', 'dark', 'system'];
			const currentIndex = themes.indexOf(current);
			const nextIndex = (currentIndex + 1) % themes.length;
			const nextTheme = themes[nextIndex];
			set(nextTheme);
			localStorage.setItem('theme', nextTheme);
			applyTheme(nextTheme);
		},
		initTheme: () => {
			if (typeof window === 'undefined') return;
			const stored = localStorage.getItem('theme') as Theme | null;
			const theme =
				stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
			set(theme);
			applyTheme(theme);
		}
	};
}

function applyTheme(theme: Theme) {
	if (typeof document === 'undefined') return;
	const html = document.documentElement;
	const isDark =
		theme === 'dark' ||
		(theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
	if (isDark) {
		html.classList.add('dark');
	} else {
		html.classList.remove('dark');
	}
}

export const themeStore = createThemeStore();
export const currentTheme = derived(themeStore, ($theme) => $theme);
export const isDarkTheme = derived(themeStore, ($theme) => {
	if (typeof window === 'undefined') return false;
	return (
		$theme === 'dark' ||
		($theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
	);
});
