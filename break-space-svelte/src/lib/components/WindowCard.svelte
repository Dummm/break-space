<script>
  export let title = '';
  export let maxWidth = 'max-w-xl'; // Tailwind max-width class, override per screen
</script>

<div
  class="rounded-3xl border-[4px] overflow-hidden {maxWidth} w-full mx-auto"
  style="border-color: var(--bs-chassisBorder); box-shadow: 0 20px 50px rgba(0,0,0,0.3), 0 8px 0 rgba(0,0,0,0.15);"
>
  <div
    class="border-b-[3px] px-4 py-3 flex items-center gap-2"
    style="background: var(--bs-titlebar); border-color: var(--bs-chassisBorder);"
  >
    <div class="w-3.5 h-3.5 rounded-full border-2" style="background: var(--bs-coral); border-color: var(--bs-coralBorder);" />
    <div class="w-3.5 h-3.5 rounded-full border-2" style="background: var(--bs-yellow); border-color: var(--bs-yellowBorder);" />
    <div class="w-3.5 h-3.5 rounded-full border-2" style="background: var(--bs-teal); border-color: var(--bs-tealBorder);" />
    <span class="ml-2 text-sm font-bold tracking-wide" style="color: var(--bs-text);">{title}</span>
    <div class="ml-auto flex items-center gap-2">
      <slot name="right" />
    </div>
  </div>
  <div class="p-8" style="background: var(--bs-panel);">
    <slot />
  </div>
</div>
