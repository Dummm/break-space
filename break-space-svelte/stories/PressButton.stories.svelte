<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PressButton from '../src/lib/components/PressButton.svelte';
  import ThemeWrapper from './ThemeWrapper.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/PressButton',
    component: PressButton,
    argTypes: {
      tone: { control: 'select', options: ['coral', 'teal', 'yellow', 'grape'] },
      disabled: { control: 'boolean' },
      themeName: { control: 'select', options: ['bubblegum', 'arcade', 'terminal'] },
    },
  });
</script>

<Story name="Coral" args={{ tone: 'coral', disabled: false, themeName: 'bubblegum' }} let:args>
  <ThemeWrapper themeName={args.themeName}>
    <PressButton tone={args.tone} disabled={args.disabled}>Create new identity</PressButton>
  </ThemeWrapper>
</Story>

<Story name="Teal" args={{ tone: 'teal', disabled: false, themeName: 'bubblegum' }} let:args>
  <ThemeWrapper themeName={args.themeName}>
    <PressButton tone={args.tone} disabled={args.disabled}>Boot into desktop</PressButton>
  </ThemeWrapper>
</Story>

<Story name="Disabled" args={{ tone: 'coral', disabled: true, themeName: 'bubblegum' }} let:args>
  <ThemeWrapper themeName={args.themeName}>
    <PressButton tone={args.tone} disabled={args.disabled}>Continue</PressButton>
  </ThemeWrapper>
</Story>

<Story name="All themes" let:args>
  <div style="display: flex; gap: 1rem;">
    <ThemeWrapper themeName="bubblegum"><PressButton tone="coral">Bubblegum</PressButton></ThemeWrapper>
    <ThemeWrapper themeName="arcade"><PressButton tone="coral">Arcade</PressButton></ThemeWrapper>
    <ThemeWrapper themeName="terminal"><PressButton tone="coral">Terminal</PressButton></ThemeWrapper>
  </div>
</Story>
