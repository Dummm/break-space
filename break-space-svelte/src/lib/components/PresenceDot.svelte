<script>
  // Reflects the ephemeral in-memory presence state from the signaling
  // server (spec §4.5) — online means "server currently has a live
  // connection for this pubkey", nothing more durable than that.
  export let online = false;
</script>

<span
  class="inline-block w-2.5 h-2.5 rounded-full border-2"
  style="
    background: {online ? 'var(--bs-teal)' : 'var(--bs-textFaint)'};
    border-color: {online ? 'var(--bs-tealBorder)' : 'var(--bs-cardBorder)'};
  "
/>
