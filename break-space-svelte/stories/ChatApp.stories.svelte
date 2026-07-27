<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ChatApp from '../src/lib/apps/ChatApp.svelte';
  import ThemeWrapper from './ThemeWrapper.svelte';

  const { Story } = defineMeta({
    title: 'Apps/ChatApp',
    component: ChatApp,
  });
</script>

<Story name="Bubblegum (default)">
  <ThemeWrapper themeName="bubblegum">
    <div style="height: 480px;"><ChatApp /></div>
  </ThemeWrapper>
</Story>

<Story name="Arcade theme">
  <ThemeWrapper themeName="arcade">
    <div style="height: 480px;"><ChatApp /></div>
  </ThemeWrapper>
</Story>
