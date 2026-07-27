<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Stage2Hello from '../src/lib/screens/Stage2Hello.svelte';
  import ThemeWrapper from './ThemeWrapper.svelte';

  const { Story } = defineMeta({
    title: 'Screens/Stage2 Hello',
    component: Stage2Hello,
  });
</script>

<Story name="Bubblegum (default)">
  <ThemeWrapper themeName="bubblegum" padded={false}>
    <Stage2Hello />
  </ThemeWrapper>
</Story>

<Story name="Arcade theme">
  <ThemeWrapper themeName="arcade" padded={false}>
    <Stage2Hello />
  </ThemeWrapper>
</Story>

<Story name="Terminal theme">
  <ThemeWrapper themeName="terminal" padded={false}>
    <Stage2Hello />
  </ThemeWrapper>
</Story>
