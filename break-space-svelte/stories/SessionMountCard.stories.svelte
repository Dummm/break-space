<script context="module">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SessionMountCard from '../src/lib/components/SessionMountCard.svelte';
  import ThemeWrapper from './ThemeWrapper.svelte';

  const { Story } = defineMeta({
    title: 'Molecules/SessionMountCard',
    component: SessionMountCard,
  });
</script>

<Story name="Default (idb/session)">
  <ThemeWrapper>
    <SessionMountCard
      sessionKey="idb/session"
      allMounts={[{ key: 'idb/session' }, { key: 'idb/hello' }]}
      loadedKeys={new Set(['idb/hello'])}
    />
  </ThemeWrapper>
</Story>

<Story name="Switched to a synced mount">
  <ThemeWrapper>
    <SessionMountCard
      sessionKey="github/my-notes-repo"
      allMounts={[
        { key: 'idb/session' },
        { key: 'idb/personal' },
        { key: 'github/my-notes-repo' },
        { key: 'gdrive/design-assets' },
      ]}
      loadedKeys={new Set(['idb/personal', 'github/my-notes-repo', 'gdrive/design-assets'])}
    />
  </ThemeWrapper>
</Story>

<Story name="Target mount not yet loaded">
  <ThemeWrapper>
    <SessionMountCard
      sessionKey="idb/session"
      allMounts={[{ key: 'idb/session' }, { key: 'github/my-notes-repo' }]}
      loadedKeys={new Set()}
    />
  </ThemeWrapper>
</Story>
