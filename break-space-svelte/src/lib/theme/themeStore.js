import { writable, derived } from 'svelte/store';
import { THEMES } from './themes.js';

// The active theme name. Persist this to localStorage/IDB in the real
// app if you want the choice to survive a reload.
export const themeName = writable('bubblegum');

// The resolved token object for the active theme.
export const theme = derived(themeName, ($themeName) => THEMES[$themeName] ?? THEMES.bubblegum);

// A ready-to-use inline `style` string of `--bs-*` custom properties.
// Apply this once, near the root of the app (e.g. in +layout.svelte or
// the top-level App.svelte) — every descendant component then just
// references `var(--bs-coral)` etc. and never needs the theme object
// passed down as a prop.
//
//   <div style={$themeCssVars}> ... rest of the app ... </div>
//
export const themeCssVars = derived(theme, ($theme) =>
  Object.entries($theme)
    .filter(([key]) => key !== 'label')
    .map(([key, value]) => `--bs-${key}: ${value};`)
    .join(' ')
);
