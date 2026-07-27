<script>
  import { createEventDispatcher } from 'svelte';
  import { X } from 'lucide-svelte';

  export let title = '';
  export let icon = null; // a Svelte component reference, e.g. HardDrive from lucide-svelte
  export let tabs = []; // array of strings, e.g. ["idb/hello", "github/my-notes-repo"]
  export let activeTab = 0;

  const dispatch = createEventDispatcher();
</script>

<div
  class="rounded-2xl border-[3px] overflow-hidden flex flex-col h-full"
  style="border-color: var(--bs-chassisBorder); box-shadow: 0 10px 30px rgba(0,0,0,0.25);"
>
  <div
    class="border-b-[3px] px-3 py-2 flex items-center gap-2 shrink-0"
    style="background: var(--bs-titlebar); border-color: var(--bs-chassisBorder);"
  >
    <div class="w-3 h-3 rounded-full border-2" style="background: var(--bs-coral); border-color: var(--bs-coralBorder);" />
    <div class="w-3 h-3 rounded-full border-2" style="background: var(--bs-yellow); border-color: var(--bs-yellowBorder);" />
    <div class="w-3 h-3 rounded-full border-2" style="background: var(--bs-teal); border-color: var(--bs-tealBorder);" />
    {#if icon}
      <svelte:component this={icon} size={13} class="ml-2" style="color: var(--bs-textMuted);" />
    {/if}
    <span class="text-xs font-bold" style="color: var(--bs-text);">{title}</span>
    <button class="ml-auto" aria-label={`Close ${title}`} on:click={() => dispatch('close')}>
      <X size={14} style="color: var(--bs-textFaint);" />
    </button>
  </div>

  {#if tabs.length > 0}
    <div class="flex gap-1 px-2 pt-2 shrink-0" style="background: var(--bs-panel);">
      {#each tabs as tab, i}
        <button
          on:click={() => dispatch('tabchange', i)}
          class="text-xs font-semibold px-3 py-1.5 rounded-t-lg border-[2px] border-b-0"
          style="
            background: {activeTab === i ? 'var(--bs-cardBg)' : 'transparent'};
            border-color: {activeTab === i ? 'var(--bs-cardBorder)' : 'transparent'};
            color: {activeTab === i ? 'var(--bs-text)' : 'var(--bs-textFaint)'};
          "
        >
          /{tab}
        </button>
      {/each}
    </div>
  {/if}

  <div class="flex-1 min-h-0 overflow-auto" style="background: var(--bs-panel);">
    <slot />
  </div>
</div>
