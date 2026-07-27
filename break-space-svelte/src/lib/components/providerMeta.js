import { HardDrive, Github, GitBranch, Cloud, Globe } from 'lucide-svelte';

// Maps a provider key (from the /{provider}/<mount-name>/** addressing
// scheme, see spec §5.5) to its display icon and label.
export const PROVIDER_META = {
  idb: { icon: HardDrive, label: 'Local (IDB)' },
  github: { icon: Github, label: 'GitHub' },
  gitlab: { icon: GitBranch, label: 'GitLab' },
  gdrive: { icon: Cloud, label: 'Google Drive' },
  public: { icon: Globe, label: 'Public' },
};

export function providerMeta(providerKey) {
  return PROVIDER_META[providerKey] ?? { icon: HardDrive, label: 'Mount' };
}
