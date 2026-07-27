<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Github, Cloud } from 'lucide-svelte';
  import ProviderCard from '../src/lib/components/ProviderCard.svelte';
  import ThemeWrapper from './ThemeWrapper.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/ProviderCard',
    component: ProviderCard,
  });
</script>

<Story name="Connected">
  <ThemeWrapper>
    <ProviderCard provider={{ key: 'github', label: 'GitHub', icon: Github, connected: true }} />
  </ThemeWrapper>
</Story>

<Story name="Not connected">
  <ThemeWrapper>
    <ProviderCard provider={{ key: 'gdrive', label: 'Google Drive', icon: Cloud, connected: false }} />
  </ThemeWrapper>
</Story>
