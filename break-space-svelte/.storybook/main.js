/** @type {import('@storybook/sveltekit').StorybookConfig} */
const config = {
  stories: ['../stories/**/*.stories.@(js|svelte)', '../src/**/*.stories.@(js|svelte)'],
  addons: [
    '@storybook/addon-svelte-csf',
    '@storybook/addon-essentials',
  ],
  framework: {
    // Swap for '@storybook/svelte-vite' if this isn't a SvelteKit app.
    name: '@storybook/sveltekit',
    options: {},
  },
};

export default config;
