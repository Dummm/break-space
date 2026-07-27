<script>
  // Tone selects which theme color family this button uses.
  // Must match a key in themes.js (coral, teal, yellow, grape).
  export let tone = 'coral';
  export let disabled = false;
  export let className = '';
</script>

<button
  {disabled}
  on:click
  class="font-semibold border-[3px] rounded-xl px-4 py-2.5 transition-transform active:translate-y-[2px] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 {className}"
  style="
    background: var(--bs-{tone});
    border-color: var(--bs-{tone}Border);
    color: var(--bs-{tone}Text);
    box-shadow: {disabled ? 'none' : 'inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 0 rgba(0,0,0,0.2)'};
  "
>
  <slot />
</button>
