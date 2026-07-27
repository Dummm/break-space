<script>
  import { Palette } from 'lucide-svelte';
  import { THEMES, THEME_NAMES } from '../theme/themes.js';
  import { themeName } from '../theme/themeStore.js';

  export let size = 20; // px, the swatch button diameter
</script>

<div class="flex items-center gap-1">
  <Palette size={size - 6} style="color: var(--bs-textFaint);" />
  {#each THEME_NAMES as key}
    <button
      on:click={() => themeName.set(key)}
      title={THEMES[key].label}
      aria-label={`Switch to ${THEMES[key].label} theme`}
      class="rounded-full border-2 transition"
      style="
        width: {size}px; height: {size}px;
        background: {THEMES[key].coral};
        border-color: {$themeName === key ? 'var(--bs-text)' : 'transparent'};
      "
    />
  {/each}
</div>
