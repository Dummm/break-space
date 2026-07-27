<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Stage1UserSetup from '../src/lib/screens/Stage1UserSetup.svelte';
  import ThemeWrapper from './ThemeWrapper.svelte';

  const { Story } = defineMeta({
    title: 'Screens/Stage1 User Setup',
    component: Stage1UserSetup,
  });
</script>

<Story name="Bubblegum (default)">
  <ThemeWrapper themeName="bubblegum" padded={false}>
    <Stage1UserSetup />
  </ThemeWrapper>
</Story>

<Story name="Arcade theme">
  <ThemeWrapper themeName="arcade" padded={false}>
    <Stage1UserSetup />
  </ThemeWrapper>
</Story>

<Story name="Terminal theme">
  <ThemeWrapper themeName="terminal" padded={false}>
    <Stage1UserSetup />
  </ThemeWrapper>
</Story>
