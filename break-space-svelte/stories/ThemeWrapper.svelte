<script>
  // Story-only helper. Wrap any component preview in this so the
  // var(--bs-*) tokens it depends on are actually defined — the real
  // app does this once at its root via themeCssVars (see
  // src/lib/theme/themeStore.js). This wrapper drives the *same*
  // shared store (rather than a separate local copy), so if a story's
  // content includes a live <ThemeSwitcher />, clicking it updates this
  // wrapper too — matching how it behaves in the real app.
  import { themeName as sharedThemeName, themeCssVars } from '../src/lib/theme/themeStore.js';

  export let themeName = 'bubblegum';
  export let padded = true;

  $: sharedThemeName.set(themeName);
</script>

<div style="{$themeCssVars} background: var(--bs-chassis); {padded ? 'padding: 2rem;' : ''}">
  <slot />
</div>

