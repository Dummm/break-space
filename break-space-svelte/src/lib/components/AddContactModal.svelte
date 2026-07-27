<script>
  import { createEventDispatcher } from 'svelte';
  import { Camera, X } from 'lucide-svelte';
  import QRCard from './QRCard.svelte';

  const dispatch = createEventDispatcher();
  let mode = 'show'; // 'show' my QR | 'scan' theirs
</script>

<div class="absolute inset-0 flex items-center justify-center" style="background: rgba(0,0,0,0.4);">
  <div class="rounded-2xl border-[3px] p-6 w-80" style="background: var(--bs-panel); border-color: var(--bs-tealBorder);">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-base font-bold" style="color: var(--bs-text);">Add a contact</h2>
      <button on:click={() => dispatch('close')} aria-label="Close">
        <X size={16} style="color: var(--bs-textFaint);" />
      </button>
    </div>

    <div class="flex gap-2 mb-4 rounded-xl p-1 border-[3px]" style="background: var(--bs-cardBg); border-color: var(--bs-cardBorder);">
      <button
        on:click={() => (mode = 'show')}
        class="flex-1 rounded-lg py-2 text-sm font-semibold"
        style="background: {mode === 'show' ? 'var(--bs-panel)' : 'transparent'}; color: var(--bs-text);"
      >
        Show my QR
      </button>
      <button
        on:click={() => (mode = 'scan')}
        class="flex-1 rounded-lg py-2 text-sm font-semibold"
        style="background: {mode === 'scan' ? 'var(--bs-panel)' : 'transparent'}; color: var(--bs-text);"
      >
        Scan theirs
      </button>
    </div>

    {#if mode === 'show'}
      <div class="flex justify-center mb-4">
        <QRCard tone="teal" label="Contact-link QR — low sensitivity" />
      </div>
      <p class="text-xs text-center" style="color: var(--bs-textFaint);">
        Anyone who scans this can send you a contact request. This QR does not expose your private key.
      </p>
    {:else}
      <div
        class="border-[3px] rounded-xl py-10 text-center mb-3 flex flex-col items-center"
        style="border-color: var(--bs-cardBorder); background: var(--bs-cardBg);"
      >
        <Camera size={26} style="color: var(--bs-textFaint);" class="mb-2" />
        <p class="text-sm" style="color: var(--bs-textMuted);">Point your camera at their contact-link QR</p>
      </div>
    {/if}
  </div>
</div>
