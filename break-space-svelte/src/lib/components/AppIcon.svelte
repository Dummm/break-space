<script>
  import { createEventDispatcher } from 'svelte';

  export let icon = null; // Svelte component reference
  export let label = '';
  export let tone = 'teal';
  export let active = false;
  export let badge = false; // quiet notification dot, e.g. "sync not connected"

  const dispatch = createEventDispatcher();
</script>

<button
  class="relative flex flex-col items-center gap-1 group"
  title={label}
  on:click={() => dispatch('click')}
>
  <div
    class="w-11 h-11 rounded-xl flex items-center justify-center border-2 transition-transform group-active:translate-y-[1px]"
    style="
      background: var(--bs-{tone});
      border-color: var(--bs-{tone}Border);
      box-shadow: {active ? '0 0 0 2px var(--bs-text)' : 'inset 0 1px 0 rgba(255,255,255,0.25)'};
    "
  >
    {#if icon}
      <svelte:component this={icon} size={20} style="color: var(--bs-{tone}Text);" />
    {/if}
  </div>
  {#if badge}
    <span
      class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
      style="background: var(--bs-yellow); border-color: var(--bs-chassis);"
    />
  {/if}
</button>
