<script>
  import {
    HardDrive, MessageCircle, Settings2, HelpCircle, FileText, Sparkles, Circle, UserCircle2, X,
  } from 'lucide-svelte';
  import AppIcon from '../components/AppIcon.svelte';
  import AppWindow from '../components/AppWindow.svelte';
  import ThemeSwitcher from '../components/ThemeSwitcher.svelte';
  import PressButton from '../components/PressButton.svelte';
  import GhostButton from '../components/GhostButton.svelte';
  import FileManagerPanel from '../components/FileManagerPanel.svelte';
  import ChatApp from '../apps/ChatApp.svelte';
  import SyncManagerApp from '../apps/SyncManagerApp.svelte';
  import { theme, themeCssVars } from '../theme/themeStore.js';

  let showNickname = true;
  let nickname = '';
  let showToast = true;
  let syncConnected = false;
  let openWindows = ['files'];
  const fmTabs = ['idb/hello', 'github/my-notes-repo'];
  let fmActiveTab = 0;

  const windowMeta = {
    files: { title: 'File Manager', icon: HardDrive, tone: 'teal' },
    chat: { title: 'Chat', icon: MessageCircle, tone: 'coral' },
    sync: { title: 'Sync Manager', icon: Settings2, tone: 'yellow' },
    help: { title: 'Help', icon: HelpCircle, tone: 'grape' },
  };

  function toggleWindow(id) {
    openWindows = openWindows.includes(id)
      ? openWindows.filter((w) => w !== id)
      : [...openWindows, id].slice(-2);
  }

  // Derives { key, provider } mount descriptors for the File Manager
  // sidebar from the tab list, e.g. "github/my-notes-repo" -> { key: "my-notes-repo", provider: "github" }
  $: fmMounts = fmTabs.map((t) => {
    const [provider, ...rest] = t.split('/');
    return { key: rest.join('/'), provider };
  });
  $: fmActiveMountKey = fmMounts[fmActiveTab]?.key ?? '';

  function selectMountInFileManager(key) {
    const idx = fmMounts.findIndex((m) => m.key === key);
    if (idx !== -1) fmActiveTab = idx;
  }
</script>

<div
  class="w-full h-[680px] relative overflow-hidden rounded-3xl border-[4px] flex flex-col"
  style="{$themeCssVars} border-color: var(--bs-chassisBorder);"
>
  <!-- wallpaper -->
  <div
    class="flex-1 min-h-0 relative p-4"
    style="background: repeating-linear-gradient(135deg, var(--bs-wallpaperA) 0px, var(--bs-wallpaperA) 24px, var(--bs-wallpaperB) 24px, var(--bs-wallpaperB) 48px);"
  >
    <!-- desktop icon -->
    <div class="flex flex-col items-center gap-1 w-16 mb-4">
      <div class="w-12 h-12 rounded-lg flex items-center justify-center border-2" style="background: var(--bs-cardBg); border-color: var(--bs-cardBorder);">
        <FileText size={20} style="color: var(--bs-yellow);" />
      </div>
      <span class="text-[11px] font-medium text-center" style="color: var(--bs-text);">Welcome.txt</span>
    </div>

    <!-- tiled windows -->
    <div
      class="absolute inset-4 top-24 grid gap-3"
      style="grid-template-columns: {openWindows.length === 2 ? '1fr 1fr' : '1fr'};"
    >
      {#if openWindows.length === 0}
        <div class="flex items-center justify-center h-full">
          <p class="text-sm" style="color: var(--bs-textFaint);">
            Nothing open — pick an app from the dock below.
          </p>
        </div>
      {/if}

      {#each openWindows as id (id)}
        {@const meta = windowMeta[id]}
        <AppWindow
          title={meta.title}
          icon={meta.icon}
          tabs={id === 'files' ? fmTabs : []}
          activeTab={fmActiveTab}
          on:close={() => toggleWindow(id)}
          on:tabchange={(e) => (fmActiveTab = e.detail)}
        >
          {#if id === 'files'}
            <FileManagerPanel
              mounts={fmMounts}
              activeMountKey={fmActiveMountKey}
              on:selectmount={(e) => selectMountInFileManager(e.detail)}
            />
          {:else if id === 'chat'}
            <ChatApp />
          {:else if id === 'sync'}
            <SyncManagerApp />
          {:else if id === 'help'}
            <div class="h-full flex flex-col items-center justify-center gap-2 p-6 text-center">
              <HelpCircle size={28} style="color: var(--bs-textFaint);" />
              <p class="text-sm" style="color: var(--bs-textMuted);">
                Search for help, or browse getting-started topics.
              </p>
            </div>
          {/if}
        </AppWindow>
      {/each}
    </div>

    <!-- toast -->
    {#if showToast}
      <div
        class="absolute bottom-4 right-4 max-w-xs rounded-xl border-[3px] p-3 flex items-start gap-2"
        style="background: var(--bs-cardBg); border-color: var(--bs-yellowBorder);"
      >
        <Sparkles size={16} class="shrink-0 mt-0.5" style="color: var(--bs-yellow);" />
        <div class="flex-1">
          <p class="text-xs" style="color: var(--bs-text);">
            Your data lives only on this device until you connect a sync provider.
          </p>
          <button
            on:click={() => { showToast = false; if (!openWindows.includes('sync')) toggleWindow('sync'); }}
            class="text-xs font-bold underline mt-1"
            style="color: var(--bs-coral);"
          >
            Open Sync Manager
          </button>
        </div>
        <button on:click={() => (showToast = false)} aria-label="Dismiss">
          <X size={13} style="color: var(--bs-textFaint);" />
        </button>
      </div>
    {/if}

    <!-- nickname modal -->
    {#if showNickname}
      <div class="absolute inset-0 flex items-center justify-center" style="background: rgba(0,0,0,0.35);">
        <div class="rounded-2xl border-[3px] p-6 w-72" style="background: var(--bs-cardBg); border-color: var(--bs-grapeBorder);">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center border-2 mb-3" style="background: var(--bs-grape); border-color: var(--bs-grapeBorder);">
            <UserCircle2 size={22} style="color: var(--bs-grapeText);" />
          </div>
          <h2 class="text-base font-bold mb-1" style="color: var(--bs-text);">What should we call you?</h2>
          <p class="text-xs mb-3" style="color: var(--bs-textMuted);">Just for display — change it anytime later.</p>
          <input
            bind:value={nickname}
            placeholder="tinkerer42"
            class="w-full border-[2px] rounded-lg px-3 py-2 text-sm mb-3"
            style="border-color: var(--bs-cardBorder); background: var(--bs-panel); color: var(--bs-text);"
          />
          <div class="flex gap-2">
            <GhostButton className="flex-1 justify-center" on:click={() => (showNickname = false)}>
              Skip
            </GhostButton>
            <PressButton tone="grape" className="flex-1" on:click={() => (showNickname = false)}>
              Continue
            </PressButton>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- taskbar -->
  <div class="shrink-0 border-t-[3px] px-4 py-2.5 flex items-center gap-4" style="background: var(--bs-titlebar); border-color: var(--bs-chassisBorder);">
    <div class="flex items-center gap-3">
      <AppIcon icon={HardDrive} label="File Manager" tone="teal" active={openWindows.includes('files')} on:click={() => toggleWindow('files')} />
      <AppIcon icon={MessageCircle} label="Chat" tone="coral" active={openWindows.includes('chat')} on:click={() => toggleWindow('chat')} />
      <AppIcon icon={Settings2} label="Sync Manager" tone="yellow" badge={!syncConnected} active={openWindows.includes('sync')} on:click={() => toggleWindow('sync')} />
      <AppIcon icon={HelpCircle} label="Help" tone="grape" active={openWindows.includes('help')} on:click={() => toggleWindow('help')} />
    </div>

    <div class="flex-1" />

    <div class="flex items-center gap-3">
      <ThemeSwitcher size={16} />
      <button
        on:click={() => (syncConnected = !syncConnected)}
        class="flex items-center gap-1.5 text-xs font-semibold"
        style="color: var(--bs-textMuted);"
        title="Toggle sync-connected state (demo only)"
      >
        <Circle size={8} fill={syncConnected ? $theme.teal : $theme.textFaint} style="color: {syncConnected ? 'var(--bs-teal)' : 'var(--bs-textFaint)'};" />
        {syncConnected ? 'Synced' : 'Local only'}
      </button>
      <div
        class="w-7 h-7 rounded-lg flex items-center justify-center border-2 text-xs font-bold"
        style="background: var(--bs-coral); border-color: var(--bs-coralBorder); color: var(--bs-coralText);"
      >
        {(nickname || '?').slice(0, 1).toUpperCase()}
      </div>
    </div>
  </div>
</div>
