<script>
  import { createEventDispatcher } from 'svelte';
  import { UserCircle2, ArrowLeftRight, Lock, Check } from 'lucide-svelte';

  // sessionKey: currently active session mount, e.g. "idb/session" or "github/my-notes-repo"
  // allMounts: array of { key: string } — must include { key: 'idb/session' } first
  // loadedKeys: a Set<string> of mount keys the user currently has loaded/checked
  export let sessionKey = 'idb/session';
  export let allMounts = [];
  export let loadedKeys = new Set();

  const dispatch = createEventDispatcher();

  let open = false;

  $: current = allMounts.find((m) => m.key === sessionKey) ?? { key: sessionKey };

  function selectMount(key) {
    dispatch('switch', key);
    open = false;
  }
</script>

<div
  class="rounded-xl border-[3px] px-4 py-3 mb-4"
  style="background: var(--bs-panel); border-color: var(--bs-grapeBorder);"
>
  <div class="flex items-center gap-3">
    <div
      class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border-2"
      style="background: var(--bs-grape); border-color: var(--bs-grapeBorder);"
    >
      <UserCircle2 size={16} style="color: var(--bs-grapeText);" />
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-1.5">
        <p class="text-sm font-semibold truncate" style="color: var(--bs-text);">/{current.key}</p>
        <span
          class="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded"
          style="background: var(--bs-grape); color: var(--bs-grapeText);"
        >
          Session
        </span>
      </div>
      <p class="text-xs" style="color: var(--bs-textFaint);">
        Contacts &amp; chat history live here{sessionKey === 'idb/session' ? ' (default, local)' : ''}
      </p>
    </div>
    <button
      on:click={() => (open = !open)}
      class="text-xs font-semibold border-[2px] rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shrink-0"
      style="border-color: var(--bs-grapeBorder); color: var(--bs-text);"
    >
      <ArrowLeftRight size={12} /> Switch
    </button>
  </div>

  {#if open}
    <div class="mt-3 pt-3 space-y-1.5" style="border-top: 2px solid var(--bs-cardBorder);">
      <p class="text-xs mb-1" style="color: var(--bs-textFaint);">
        Choose which mount holds your session. Only mounts you've already loaded below are eligible
        — mount one first, then switch to it here.
      </p>
      {#each allMounts as m}
        {@const isLoaded = loadedKeys.has(m.key) || m.key === 'idb/session'}
        {@const isCurrent = m.key === sessionKey}
        <button
          disabled={!isLoaded}
          on:click={() => selectMount(m.key)}
          class="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs disabled:opacity-40 disabled:cursor-not-allowed"
          style="
            background: {isCurrent ? 'var(--bs-cardBg)' : 'transparent'};
            border: 2px solid {isCurrent ? 'var(--bs-grapeBorder)' : 'transparent'};
          "
        >
          <span class="flex-1 font-medium" style="color: var(--bs-text);">/{m.key}</span>
          {#if !isLoaded}
            <span class="flex items-center gap-1" style="color: var(--bs-textFaint);">
              <Lock size={11} /> mount this first
            </span>
          {/if}
          {#if isCurrent}
            <Check size={13} style="color: var(--bs-grape);" />
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>
