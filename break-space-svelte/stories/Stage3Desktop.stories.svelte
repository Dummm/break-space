<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Stage3Desktop from '../src/lib/screens/Stage3Desktop.svelte';
  import ThemeWrapper from './ThemeWrapper.svelte';

  const { Story } = defineMeta({
    title: 'Screens/Stage3 Desktop',
    component: Stage3Desktop,
  });
</script>

<Story name="Bubblegum (default)">
  <ThemeWrapper themeName="bubblegum" padded={false}>
    <Stage3Desktop />
  </ThemeWrapper>
</Story>

<Story name="Arcade theme">
  <ThemeWrapper themeName="arcade" padded={false}>
    <Stage3Desktop />
  </ThemeWrapper>
</Story>

<Story name="Terminal theme">
  <ThemeWrapper themeName="terminal" padded={false}>
    <Stage3Desktop />
  </ThemeWrapper>
</Story>
