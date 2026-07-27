<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ContactRow from '../src/lib/components/ContactRow.svelte';
  import ThemeWrapper from './ThemeWrapper.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/ContactRow',
    component: ContactRow,
  });
</script>

<Story name="Online, unread">
  <ThemeWrapper>
    <ContactRow contact={{ nickname: 'tinkerer42', tone: 'coral', online: true, unread: 2, lastMessage: 'sent you a file' }} />
  </ThemeWrapper>
</Story>

<Story name="Offline, read">
  <ThemeWrapper>
    <ContactRow contact={{ nickname: 'glowworm', tone: 'grape', online: false, unread: 0, lastMessage: 'see you tomorrow' }} />
  </ThemeWrapper>
</Story>

<Story name="Active/selected">
  <ThemeWrapper>
    <ContactRow contact={{ nickname: 'pixel_fox', tone: 'yellow', online: true, unread: 0, lastMessage: 'ok!' }} active />
  </ThemeWrapper>
</Story>
