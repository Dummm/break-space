<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SyncManagerApp from '../src/lib/apps/SyncManagerApp.svelte';
  import ThemeWrapper from './ThemeWrapper.svelte';

  const { Story } = defineMeta({
    title: 'Apps/SyncManagerApp',
    component: SyncManagerApp,
  });
</script>

<Story name="Bubblegum (default) — includes a conflict">
  <ThemeWrapper themeName="bubblegum">
    <div style="height: 480px;"><SyncManagerApp /></div>
  </ThemeWrapper>
</Story>

<Story name="Terminal theme">
  <ThemeWrapper themeName="terminal">
    <div style="height: 480px;"><SyncManagerApp /></div>
  </ThemeWrapper>
</Story>
