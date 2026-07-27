<script>
  export let label = '?';
  export let tone = 'coral';
  export let size = 36;
</script>

<div
  class="rounded-lg flex items-center justify-center border-2 font-bold shrink-0"
  style="
    width: {size}px; height: {size}px;
    background: var(--bs-{tone});
    border-color: var(--bs-{tone}Border);
    color: var(--bs-{tone}Text);
    font-size: {Math.round(size * 0.4)}px;
  "
>
  {(label || '?').slice(0, 1).toUpperCase()}
</div>
