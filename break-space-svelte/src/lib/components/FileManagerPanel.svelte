<script>
  import { createEventDispatcher } from 'svelte';
  import { Eye, EyeOff, Folder, FileText, Image, Search, FolderPlus, Trash2, X } from 'lucide-svelte';
  import { providerMeta } from './providerMeta.js';

  // mounts: array of { key: 'hello', provider: 'idb' } — one entry per
  // mounted directory shown in the sidebar
  export let mounts = [];
  export let activeMountKey = '';

  // Replace with real directory listing data from IDB / the sync layer.
  // The `.bs` entry is only ever shown when `showHidden` is true, and is
  // visually dimmed — same convention as a Unix dotfile, per spec §5.4.
  export let files = [
    { name: 'Welcome.txt', type: 'file' },
    { name: 'notes', type: 'folder' },
    { name: 'photo.jpg', type: 'file' },
    { name: 'ideas.md', type: 'file' },
  ];

  const dispatch = createEventDispatcher();

  let showHidden = false;
  let query = '';
  let selected = new Set();

  $: allFiles = showHidden ? [...files, { name: '.bs', type: 'folder', dim: true }] : files;
  $: visibleFiles = query
    ? allFiles.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))
    : allFiles;

  function iconFor(file) {
    if (file.type === 'folder') return Folder;
    if (/\.(jpg|png|jpeg|gif)$/i.test(file.name)) return Image;
    return FileText;
  }

  function toggleSelect(name) {
    const next = new Set(selected);
    next.has(name) ? next.delete(name) : next.add(name);
    selected = next;
  }

  function clearSelection() {
    selected = new Set();
  }

  function deleteSelected() {
    dispatch('delete', [...selected]);
    files = files.filter((f) => !selected.has(f.name));
    clearSelection();
  }

  function newFolder() {
    dispatch('newfolder');
    // Demo-only: append a placeholder folder with a unique name.
    const name = `New folder${files.some((f) => f.name === 'New folder') ? ` ${files.length}` : ''}`;
    files = [...files, { name, type: 'folder' }];
  }
</script>

<div class="flex h-full">
  <div class="w-40 shrink-0 border-r-[2px] p-2 space-y-1" style="border-color: var(--bs-cardBorder);">
    <p class="text-[10px] font-bold uppercase tracking-wide px-2 mb-1" style="color: var(--bs-textFaint);">
      Mounts
    </p>
    {#each mounts as m}
      {@const meta = providerMeta(m.provider)}
      {@const active = m.key === activeMountKey}
      <button
        on:click={() => dispatch('selectmount', m.key)}
        class="w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-left"
        style="background: {active ? 'var(--bs-cardBg)' : 'transparent'};"
      >
        <svelte:component this={meta.icon} size={14} style="color: var(--bs-teal);" />
        <span class="text-xs font-medium truncate" style="color: var(--bs-text);">{m.key}</span>
      </button>
    {/each}
  </div>

  <div class="flex-1 min-w-0 flex flex-col">
    <!-- toolbar -->
    <div class="flex items-center gap-2 p-2 border-b-[2px]" style="border-color: var(--bs-cardBorder);">
      <div class="flex-1 flex items-center gap-1.5 rounded-lg border-2 px-2 py-1" style="border-color: var(--bs-cardBorder); background: var(--bs-cardBg);">
        <Search size={13} style="color: var(--bs-textFaint);" />
        <input
          bind:value={query}
          placeholder="Search this mount..."
          class="flex-1 text-xs bg-transparent focus:outline-none"
          style="color: var(--bs-text);"
        />
      </div>
      <button
        on:click={newFolder}
        class="flex items-center gap-1 text-xs font-semibold border-2 rounded-lg px-2 py-1.5 shrink-0"
        style="border-color: var(--bs-cardBorder); color: var(--bs-textMuted);"
      >
        <FolderPlus size={13} /> New folder
      </button>
      <button
        on:click={() => (showHidden = !showHidden)}
        class="flex items-center gap-1 text-xs font-semibold shrink-0"
        style="color: var(--bs-textMuted);"
      >
        <svelte:component this={showHidden ? EyeOff : Eye} size={13} />
        {showHidden ? 'Hide' : 'Show'} hidden
      </button>
    </div>

    <!-- selection bar -->
    {#if selected.size > 0}
      <div class="flex items-center gap-2 px-3 py-2 border-b-[2px]" style="border-color: var(--bs-cardBorder); background: var(--bs-panel);">
        <span class="text-xs font-semibold" style="color: var(--bs-text);">{selected.size} selected</span>
        <button on:click={deleteSelected} class="flex items-center gap-1 text-xs font-semibold" style="color: var(--bs-coralBorder);">
          <Trash2 size={12} /> Delete
        </button>
        <button on:click={clearSelection} class="ml-auto" aria-label="Clear selection">
          <X size={13} style="color: var(--bs-textFaint);" />
        </button>
      </div>
    {/if}

    <div class="flex-1 overflow-auto p-3">
      <div class="flex items-center gap-1 text-xs mb-3" style="color: var(--bs-textFaint);">
        <span>/{activeMountKey}</span>
      </div>
      <div class="grid grid-cols-3 gap-3">
        {#each visibleFiles as f}
          {@const isSelected = selected.has(f.name)}
          <button
            on:click={() => toggleSelect(f.name)}
            class="flex flex-col items-center gap-1 rounded-lg p-1.5"
            style="opacity: {f.dim ? 0.55 : 1}; background: {isSelected ? 'var(--bs-panel)' : 'transparent'};"
          >
            <div
              class="w-12 h-12 rounded-lg flex items-center justify-center border-2"
              style="background: var(--bs-cardBg); border-color: {isSelected ? 'var(--bs-tealBorder)' : 'var(--bs-cardBorder)'};"
            >
              <svelte:component this={iconFor(f)} size={20} style="color: var(--bs-yellow);" />
            </div>
            <span class="text-[11px] text-center truncate w-full" style="color: var(--bs-text);">
              {f.name}
            </span>
          </button>
        {/each}
        {#if visibleFiles.length === 0}
          <p class="col-span-3 text-xs text-center py-6" style="color: var(--bs-textFaint);">
            No files match "{query}"
          </p>
        {/if}
      </div>
    </div>
  </div>
</div>
