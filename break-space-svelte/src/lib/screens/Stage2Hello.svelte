<script>
  import {
    Plus, Rocket, Settings2, Folder, Cloud, Globe, ChevronRight,
  } from 'lucide-svelte';
  import WindowCard from '../components/WindowCard.svelte';
  import PressButton from '../components/PressButton.svelte';
  import GhostButton from '../components/GhostButton.svelte';
  import ThemeSwitcher from '../components/ThemeSwitcher.svelte';
  import MountRow from '../components/MountRow.svelte';
  import SessionMountCard from '../components/SessionMountCard.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  // Demo-only fixture data — replace with real mount state from the
  // storage layer. In the real app, `userType` is derived from whether
  // a stored mount configuration exists for this identity, not chosen
  // by the user.
  const RETURNING_MOUNTS = [
    { provider: 'idb', name: 'personal', status: 'local only' },
    { provider: 'github', name: 'my-notes-repo', status: 'synced 2h ago' },
    { provider: 'gdrive', name: 'design-assets', status: 'synced yesterday' },
  ];

  let userType = 'new'; // 'new' | 'returning'
  let selected = new Set(['idb/hello']);
  let sessionKey = 'idb/session';
  let showAddMount = false;
  let booting = false;

  $: totalMounts = userType === 'new' ? 1 : RETURNING_MOUNTS.length;
  $: sessionAllMounts = [
    { key: 'idb/session' },
    ...(userType === 'new'
      ? [{ key: 'idb/hello' }]
      : RETURNING_MOUNTS.map((m) => ({ key: `${m.provider}/${m.name}` }))),
  ];

  function switchUserType(type) {
    userType = type;
    selected = new Set(
      type === 'new' ? ['idb/hello'] : RETURNING_MOUNTS.map((m) => `${m.provider}/${m.name}`)
    );
    sessionKey = 'idb/session';
    booting = false;
  }

  function toggle(key) {
    const next = new Set(selected);
    next.has(key) ? next.delete(key) : next.add(key);
    selected = next;
  }

  function boot() {
    booting = true;
    // In the real app, this is where mounts actually get loaded, then
    // the parent should navigate to Stage 3 (Desktop) on completion:
    // dispatch('boot', { mounts: [...selected], sessionKey });
  }
</script>

<div class="min-h-[640px] w-full flex flex-col items-center justify-center p-6 gap-4" style="background: var(--bs-chassis);">
  <!-- dev-only state toggle, not part of the real UI -->
  <div class="flex items-center gap-3 mb-1 text-xs" style="color: var(--bs-textFaint);">
    <span>Demo state:</span>
    <button
      on:click={() => switchUserType('new')}
      class="underline underline-offset-2"
      style="color: {userType === 'new' ? 'var(--bs-text)' : 'var(--bs-textFaint)'};"
    >
      new user
    </button>
    <button
      on:click={() => switchUserType('returning')}
      class="underline underline-offset-2"
      style="color: {userType === 'returning' ? 'var(--bs-text)' : 'var(--bs-textFaint)'};"
    >
      returning user
    </button>
  </div>

  {#if !booting}
    <WindowCard title="break-space — hello" maxWidth="max-w-2xl">
      <svelte:fragment slot="right">
        <ThemeSwitcher size={20} />
      </svelte:fragment>

      <h1 class="text-2xl font-extrabold mb-1" style="color: var(--bs-text);">
        {userType === 'new' ? 'Hello — first boot' : 'Welcome back'}
      </h1>
      <p class="text-sm mb-6" style="color: var(--bs-textMuted);">
        {userType === 'new'
          ? "We've mounted a starter directory for you. Pick what to load, or add more."
          : 'Here\'s what you had mounted last time. Adjust the selection, then boot in.'}
      </p>

      <SessionMountCard
        {sessionKey}
        allMounts={sessionAllMounts}
        loadedKeys={selected}
        on:switch={(e) => (sessionKey = e.detail)}
      />

      <div class="space-y-2 mb-4">
        {#if userType === 'new'}
          <MountRow
            mount={{ provider: 'idb', name: 'hello', status: 'ready' }}
            checked={selected.has('idb/hello')}
            on:click={() => toggle('idb/hello')}
          />
        {:else}
          {#each RETURNING_MOUNTS as m}
            <MountRow
              mount={m}
              checked={selected.has(`${m.provider}/${m.name}`)}
              on:click={() => toggle(`${m.provider}/${m.name}`)}
            />
          {/each}
        {/if}
      </div>

      <GhostButton className="w-full mb-6 justify-center" on:click={() => (showAddMount = !showAddMount)}>
        <Plus size={16} /> Mount something else
        <ChevronRight size={14} class="ml-auto transition-transform {showAddMount ? 'rotate-90' : ''}" />
      </GhostButton>

      {#if showAddMount}
        <div class="grid grid-cols-3 gap-2 mb-6">
          <GhostButton className="flex-col text-xs py-4">
            <Folder size={18} />
            New local workspace
          </GhostButton>
          <GhostButton className="flex-col text-xs py-4">
            <Cloud size={18} />
            Connect a provider
          </GhostButton>
          <GhostButton className="flex-col text-xs py-4">
            <Globe size={18} />
            Browse public
          </GhostButton>
        </div>
      {/if}

      <div class="flex items-center gap-3">
        <GhostButton className="text-sm px-3 py-2">
          <Settings2 size={14} /> Mount manager
        </GhostButton>
        <PressButton tone="teal" className="flex-1" disabled={selected.size === 0} on:click={boot}>
          <Rocket size={16} /> Boot into desktop
        </PressButton>
      </div>

      <p class="text-xs text-center mt-4" style="color: var(--bs-textFaint);">
        {selected.size} of {totalMounts} mount{totalMounts === 1 ? '' : 's'} selected — you can mount
        or unmount anytime from File Manager
      </p>
    </WindowCard>
  {:else}
    <WindowCard title="break-space — booting" maxWidth="max-w-2xl">
      <div class="text-center py-10">
        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-2xl border-[3px] mb-4 animate-pulse"
          style="background: var(--bs-teal); border-color: var(--bs-tealBorder);"
        >
          <Rocket size={28} style="color: var(--bs-tealText);" />
        </div>
        <h2 class="text-xl font-bold mb-1" style="color: var(--bs-text);">
          Loading {selected.size} mount{selected.size === 1 ? '' : 's'}…
        </h2>
        <p class="text-sm mb-6" style="color: var(--bs-textMuted);">Next stop: the desktop.</p>
        <GhostButton className="mx-auto" on:click={() => (booting = false)}>
          Back to Hello screen
        </GhostButton>
      </div>
    </WindowCard>
  {/if}
</div>
