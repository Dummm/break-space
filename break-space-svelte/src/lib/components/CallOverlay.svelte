<script>
  import { createEventDispatcher } from 'svelte';
  import { PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-svelte';

  export let contact; // { nickname, ... }
  export let callType = 'video'; // 'voice' | 'video'

  const dispatch = createEventDispatcher();

  let muted = false;
  let videoOff = callType === 'voice';
</script>

<div class="absolute inset-0 flex flex-col items-center justify-between p-6" style="background: rgba(10,10,10,0.92);">
  <div class="text-center mt-8">
    <p class="text-sm" style="color: #ddd;">Call with</p>
    <h2 class="text-xl font-bold text-white">{contact?.nickname ?? 'Unknown'}</h2>
  </div>

  <div class="flex-1 w-full flex items-center justify-center">
    {#if !videoOff}
      <div class="w-64 h-40 rounded-xl border-2 flex items-center justify-center" style="background: #222; border-color: #444;">
        <span class="text-xs" style="color: #888;">video preview placeholder</span>
      </div>
    {:else}
      <div class="w-24 h-24 rounded-full flex items-center justify-center border-2" style="background: var(--bs-coral); border-color: var(--bs-coralBorder);">
        <span class="text-2xl font-bold" style="color: var(--bs-coralText);">
          {(contact?.nickname ?? '?').slice(0, 1).toUpperCase()}
        </span>
      </div>
    {/if}
  </div>

  <div class="flex items-center gap-4 mb-4">
    <button
      on:click={() => (muted = !muted)}
      class="w-12 h-12 rounded-full flex items-center justify-center border-2"
      style="background: #333; border-color: #555;"
      aria-label={muted ? 'Unmute' : 'Mute'}
    >
      <svelte:component this={muted ? MicOff : Mic} size={20} color="white" />
    </button>
    {#if callType === 'video'}
      <button
        on:click={() => (videoOff = !videoOff)}
        class="w-12 h-12 rounded-full flex items-center justify-center border-2"
        style="background: #333; border-color: #555;"
        aria-label={videoOff ? 'Turn camera on' : 'Turn camera off'}
      >
        <svelte:component this={videoOff ? VideoOff : Video} size={20} color="white" />
      </button>
    {/if}
    <button
      on:click={() => dispatch('hangup')}
      class="w-14 h-14 rounded-full flex items-center justify-center border-2"
      style="background: var(--bs-coral); border-color: var(--bs-coralBorder);"
      aria-label="Hang up"
    >
      <PhoneOff size={22} style="color: var(--bs-coralText);" />
    </button>
  </div>
</div>
