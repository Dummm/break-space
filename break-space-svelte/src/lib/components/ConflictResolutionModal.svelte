<script>
  import { createEventDispatcher } from 'svelte';
  import { X } from 'lucide-svelte';
  import GhostButton from './GhostButton.svelte';

  // mount: { key, provider, status, conflict }
  export let mount;

  const dispatch = createEventDispatcher();
</script>

<div class="absolute inset-0 flex items-center justify-center" style="background: rgba(0,0,0,0.4);">
  <div class="rounded-2xl border-[3px] p-6 w-96" style="background: var(--bs-panel); border-color: var(--bs-coralBorder);">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-base font-bold" style="color: var(--bs-text);">
        Sync conflict — /{mount?.provider}/{mount?.key}
      </h2>
      <button on:click={() => dispatch('close')} aria-label="Close">
        <X size={16} style="color: var(--bs-textFaint);" />
      </button>
    </div>
    <p class="text-sm mb-4" style="color: var(--bs-textMuted);">
      This mount changed both locally and on the remote provider since the last sync. Choose which
      version to keep.
    </p>
    <div class="grid grid-cols-2 gap-3 mb-4">
      <button
        on:click={() => dispatch('resolved', 'local')}
        class="rounded-xl border-[3px] p-3 text-left"
        style="border-color: var(--bs-cardBorder); background: var(--bs-cardBg);"
      >
        <p class="text-xs font-bold mb-1" style="color: var(--bs-text);">Keep local</p>
        <p class="text-xs" style="color: var(--bs-textFaint);">Overwrites the remote copy with what's on this device.</p>
      </button>
      <button
        on:click={() => dispatch('resolved', 'remote')}
        class="rounded-xl border-[3px] p-3 text-left"
        style="border-color: var(--bs-cardBorder); background: var(--bs-cardBg);"
      >
        <p class="text-xs font-bold mb-1" style="color: var(--bs-text);">Keep remote</p>
        <p class="text-xs" style="color: var(--bs-textFaint);">Overwrites this device with the remote copy.</p>
      </button>
    </div>
    <GhostButton className="w-full justify-center" on:click={() => dispatch('close')}>
      Decide later
    </GhostButton>
  </div>
</div>
