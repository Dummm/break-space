<script>
  import { Github, GitBranch, Cloud, Globe } from 'lucide-svelte';
  import ProviderCard from '../components/ProviderCard.svelte';
  import MountManagerRow from '../components/MountManagerRow.svelte';
  import ConflictResolutionModal from '../components/ConflictResolutionModal.svelte';

  // Fixture data — replace with real provider-connection and mount
  // state from the storage layer (spec §5).
  let providers = [
    { key: 'github', label: 'GitHub', icon: Github, connected: true },
    { key: 'gitlab', label: 'GitLab', icon: GitBranch, connected: false },
    { key: 'gdrive', label: 'Google Drive', icon: Cloud, connected: true },
    { key: 'ipfs', label: 'IPFS', icon: Globe, connected: false },
  ];

  let mounts = [
    { key: 'personal', provider: 'idb', status: 'local only', conflict: false },
    { key: 'my-notes-repo', provider: 'github', status: 'synced 2h ago', conflict: false },
    { key: 'design-assets', provider: 'gdrive', status: 'conflict — changed locally & remotely', conflict: true },
  ];

  let conflictMount = null;

  function toggleProvider(key) {
    providers = providers.map((p) => (p.key === key ? { ...p, connected: !p.connected } : p));
  }

  function unmount(key) {
    mounts = mounts.filter((m) => m.key !== key);
  }

  function resolveConflict(mountKey, choice) {
    mounts = mounts.map((m) =>
      m.key === mountKey ? { ...m, conflict: false, status: `resolved (kept ${choice})` } : m
    );
    conflictMount = null;
  }
</script>

<div class="h-full overflow-auto p-4 relative">
  <p class="text-[10px] font-bold uppercase tracking-wide mb-2" style="color: var(--bs-textFaint);">Providers</p>
  <div class="space-y-2 mb-5">
    {#each providers as p (p.key)}
      <ProviderCard provider={p} on:toggle={() => toggleProvider(p.key)} />
    {/each}
  </div>

  <p class="text-[10px] font-bold uppercase tracking-wide mb-2" style="color: var(--bs-textFaint);">
    Mounted directories
  </p>
  <div class="space-y-2">
    {#each mounts as m (m.key)}
      <MountManagerRow mount={m} on:unmount={() => unmount(m.key)} on:resolve={() => (conflictMount = m)} />
    {/each}
    {#if mounts.length === 0}
      <p class="text-xs" style="color: var(--bs-textFaint);">Nothing mounted yet.</p>
    {/if}
  </div>

  {#if conflictMount}
    <ConflictResolutionModal
      mount={conflictMount}
      on:close={() => (conflictMount = null)}
      on:resolved={(e) => resolveConflict(conflictMount.key, e.detail)}
    />
  {/if}
</div>
