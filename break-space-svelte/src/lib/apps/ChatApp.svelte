<script>
  import { Plus, Phone, Video, Send } from 'lucide-svelte';
  import ContactRow from '../components/ContactRow.svelte';
  import MessageBubble from '../components/MessageBubble.svelte';
  import AddContactModal from '../components/AddContactModal.svelte';
  import CallOverlay from '../components/CallOverlay.svelte';

  // Fixture data — replace with real contacts/threads from the
  // session-mount-backed chat store (spec §4.4).
  const CONTACTS = [
    { id: 'a', nickname: 'tinkerer42', tone: 'coral', online: true, unread: 2, lastMessage: 'sent you a file' },
    { id: 'b', nickname: 'glowworm', tone: 'grape', online: false, unread: 0, lastMessage: 'see you tomorrow' },
    { id: 'c', nickname: 'pixel_fox', tone: 'yellow', online: true, unread: 0, lastMessage: 'ok!' },
  ];

  const THREADS = {
    a: [
      { from: 'them', text: 'hey, check out this file', time: '10:02' },
      { from: 'me', text: 'nice, thanks!', time: '10:03' },
    ],
    b: [{ from: 'them', text: 'see you tomorrow', time: 'yesterday' }],
    c: [
      { from: 'me', text: 'sounds good', time: '2d ago' },
      { from: 'them', text: 'ok!', time: '2d ago' },
    ],
  };

  let activeId = CONTACTS[0].id;
  let showAddContact = false;
  let activeCall = null; // { contact, type } | null
  let draft = '';

  $: activeContact = CONTACTS.find((c) => c.id === activeId);
  $: thread = THREADS[activeId] ?? [];

  function send() {
    if (!draft.trim()) return;
    thread = [...thread, { from: 'me', text: draft, time: 'now' }];
    THREADS[activeId] = thread;
    draft = '';
  }
</script>

<div class="flex h-full relative">
  <div class="w-52 shrink-0 border-r-[2px] flex flex-col" style="border-color: var(--bs-cardBorder);">
    <div class="flex items-center justify-between px-3 py-2">
      <p class="text-[10px] font-bold uppercase tracking-wide" style="color: var(--bs-textFaint);">Contacts</p>
      <button on:click={() => (showAddContact = true)} aria-label="Add contact">
        <Plus size={14} style="color: var(--bs-textMuted);" />
      </button>
    </div>
    <div class="flex-1 overflow-auto px-1">
      {#each CONTACTS as c (c.id)}
        <ContactRow contact={c} active={c.id === activeId} on:click={() => (activeId = c.id)} />
      {/each}
    </div>
  </div>

  <div class="flex-1 min-w-0 flex flex-col">
    <div class="flex items-center justify-between px-4 py-2 border-b-[2px]" style="border-color: var(--bs-cardBorder);">
      <p class="text-sm font-semibold" style="color: var(--bs-text);">{activeContact?.nickname ?? ''}</p>
      <div class="flex items-center gap-3">
        <button on:click={() => (activeCall = { contact: activeContact, type: 'voice' })} aria-label="Voice call">
          <Phone size={16} style="color: var(--bs-textMuted);" />
        </button>
        <button on:click={() => (activeCall = { contact: activeContact, type: 'video' })} aria-label="Video call">
          <Video size={16} style="color: var(--bs-textMuted);" />
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-auto p-4">
      {#each thread as m}
        <MessageBubble message={m} />
      {/each}
    </div>

    <div class="p-3 border-t-[2px] flex items-center gap-2" style="border-color: var(--bs-cardBorder);">
      <input
        bind:value={draft}
        on:keydown={(e) => e.key === 'Enter' && send()}
        placeholder="Message..."
        class="flex-1 border-[2px] rounded-lg px-3 py-2 text-sm focus:outline-none"
        style="border-color: var(--bs-cardBorder); background: var(--bs-cardBg); color: var(--bs-text);"
      />
      <button
        on:click={send}
        class="w-9 h-9 rounded-lg flex items-center justify-center border-2 shrink-0"
        style="background: var(--bs-teal); border-color: var(--bs-tealBorder);"
        aria-label="Send message"
      >
        <Send size={15} style="color: var(--bs-tealText);" />
      </button>
    </div>
  </div>

  {#if showAddContact}
    <AddContactModal on:close={() => (showAddContact = false)} />
  {/if}

  {#if activeCall}
    <CallOverlay contact={activeCall.contact} callType={activeCall.type} on:hangup={() => (activeCall = null)} />
  {/if}
</div>
