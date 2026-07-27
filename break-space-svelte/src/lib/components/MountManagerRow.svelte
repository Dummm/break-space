<script>
  import { createEventDispatcher } from 'svelte';
  import { AlertTriangle, X } from 'lucide-svelte';
  import { providerMeta } from './providerMeta.js';

  // mount: { key, provider, status, conflict }
  export let mount;

  const dispatch = createEventDispatcher();

  $: meta = providerMeta(mount.provider);
</script>

<div
  class="flex items-center gap-3 rounded-xl border-[3px] px-4 py-3"
  style="background: var(--bs-cardBg); border-color: {mount.conflict ? 'var(--bs-coralBorder)' : 'var(--bs-cardBorder)'};"
>
  <div
    class="w-9 h-9 rounded-lg flex items-center justify-center border-2 shrink-0"
    style="background: var(--bs-teal); border-color: var(--bs-tealBorder);"
  >
    <svelte:component this={meta.icon} size={16} style="color: var(--bs-tealText);" />
  </div>
  <div class="flex-1 min-w-0">
    <p class="text-sm font-semibold truncate" style="color: var(--bs-text);">/{mount.provider}/{mount.key}</p>
    <p class="text-xs flex items-center gap-1" style="color: {mount.conflict ? 'var(--bs-coralBorder)' : 'var(--bs-textFaint)'};">
      {#if mount.conflict}<AlertTriangle size={11} />{/if}
      {mount.status}
    </p>
  </div>
  {#if mount.conflict}
    <button
      on:click={() => dispatch('resolve')}
      class="text-xs font-semibold border-[2px] rounded-lg px-2.5 py-1.5 shrink-0"
      style="border-color: var(--bs-coralBorder); color: var(--bs-coralBorder);"
    >
      Resolve
    </button>
  {/if}
  <button on:click={() => dispatch('unmount')} aria-label="Unmount" class="shrink-0">
    <X size={14} style="color: var(--bs-textFaint);" />
  </button>
</div>
