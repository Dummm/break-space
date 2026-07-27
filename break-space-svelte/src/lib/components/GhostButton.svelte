<script>
  export let disabled = false;
  export let className = '';
</script>

<button
  {disabled}
  on:click
  class="font-semibold border-[2px] rounded-lg px-3 py-2 transition-transform active:translate-y-[1px] flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed {className}"
  style="background: transparent; border-color: var(--bs-cardBorder); color: var(--bs-textMuted);"
>
  <slot />
</button>
