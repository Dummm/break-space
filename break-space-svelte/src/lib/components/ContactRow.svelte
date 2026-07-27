<script>
  import { createEventDispatcher } from 'svelte';
  import Avatar from './Avatar.svelte';
  import PresenceDot from './PresenceDot.svelte';

  // contact: { id, nickname, tone, online, unread, lastMessage }
  export let contact;
  export let active = false;

  const dispatch = createEventDispatcher();
</script>

<button
  on:click={() => dispatch('click')}
  class="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition"
  style="background: {active ? 'var(--bs-cardBg)' : 'transparent'};"
>
  <div class="relative shrink-0">
    <Avatar label={contact.nickname} tone={contact.tone ?? 'coral'} />
    <span class="absolute -bottom-0.5 -right-0.5">
      <PresenceDot online={contact.online} />
    </span>
  </div>
  <div class="flex-1 min-w-0">
    <div class="flex items-center justify-between gap-2">
      <p class="text-sm font-semibold truncate" style="color: var(--bs-text);">{contact.nickname}</p>
      {#if contact.unread}
        <span
          class="text-[10px] font-bold rounded-full px-1.5 shrink-0"
          style="background: var(--bs-coral); color: var(--bs-coralText);"
        >
          {contact.unread}
        </span>
      {/if}
    </div>
    <p class="text-xs truncate" style="color: var(--bs-textFaint);">
      {contact.lastMessage ?? (contact.online ? 'Online' : 'Offline')}
    </p>
  </div>
</button>
