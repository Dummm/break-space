<script>
  import FakeQR from './FakeQR.svelte';

  // tone 'coral' = identity QR (high sensitivity, leaks private key)
  // tone 'teal'  = contact-link QR (low sensitivity, peer handshake only)
  // See spec §4.3 — these two QR types must stay visually distinct.
  export let tone = 'teal';
  export let label = 'Contact-link QR — low sensitivity';
</script>

<div
  class="rounded-xl border-[3px] p-4 flex flex-col items-center justify-center"
  style="background: var(--bs-cardBg); border-color: var(--bs-cardBorder);"
>
  <FakeQR {tone} />
  <span class="text-[10px] mt-2 font-bold uppercase tracking-wide" style="color: var(--bs-{tone}Border);">
    {label}
  </span>
</div>
