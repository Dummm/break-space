<script>
  import { Check } from 'lucide-svelte';
  import { providerMeta } from './providerMeta.js';

  // mount: { provider: 'github', name: 'my-notes-repo', status: 'synced 2h ago' }
  export let mount;
  export let checked = false;

  $: meta = providerMeta(mount.provider);
</script>

<button
  on:click
  class="w-full flex items-center gap-3 rounded-xl border-[3px] px-4 py-3 text-left transition"
  style="
    background: {checked ? 'var(--bs-panel)' : 'var(--bs-cardBg)'};
    border-color: {checked ? 'var(--bs-tealBorder)' : 'var(--bs-cardBorder)'};
  "
>
  <div
    class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border-2"
    style="background: var(--bs-teal); border-color: var(--bs-tealBorder);"
  >
    <svelte:component this={meta.icon} size={16} style="color: var(--bs-tealText);" />
  </div>
  <div class="flex-1 min-w-0">
    <p class="text-sm font-semibold truncate" style="color: var(--bs-text);">
      /{mount.provider}/{mount.name}
    </p>
    <p class="text-xs" style="color: var(--bs-textFaint);">
      {meta.label} · {mount.status}
    </p>
  </div>
  <div
    class="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0"
    style="
      border-color: {checked ? 'var(--bs-tealBorder)' : 'var(--bs-cardBorder)'};
      background: {checked ? 'var(--bs-teal)' : 'transparent'};
    "
  >
    {#if checked}
      <Check size={13} style="color: var(--bs-tealText);" />
    {/if}
  </div>
</button>
