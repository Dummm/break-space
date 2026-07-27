<script>
  import { createEventDispatcher } from 'svelte';
  import { Check, Plus } from 'lucide-svelte';

  // provider: { key, label, icon, connected }
  export let provider;

  const dispatch = createEventDispatcher();
</script>

<div
  class="flex items-center gap-3 rounded-xl border-[3px] px-4 py-3"
  style="background: var(--bs-cardBg); border-color: var(--bs-cardBorder);"
>
  <div
    class="w-9 h-9 rounded-lg flex items-center justify-center border-2 shrink-0"
    style="background: var(--bs-teal); border-color: var(--bs-tealBorder);"
  >
    <svelte:component this={provider.icon} size={16} style="color: var(--bs-tealText);" />
  </div>
  <div class="flex-1 min-w-0">
    <p class="text-sm font-semibold" style="color: var(--bs-text);">{provider.label}</p>
    <p class="text-xs" style="color: var(--bs-textFaint);">{provider.connected ? 'Connected' : 'Not connected'}</p>
  </div>
  <button
    on:click={() => dispatch('toggle')}
    class="text-xs font-semibold border-[2px] rounded-lg px-2.5 py-1.5 flex items-center gap-1 shrink-0"
    style="border-color: {provider.connected ? 'var(--bs-cardBorder)' : 'var(--bs-tealBorder)'}; color: var(--bs-text);"
  >
    <svelte:component this={provider.connected ? Check : Plus} size={12} />
    {provider.connected ? 'Connected' : 'Connect'}
  </button>
</div>
