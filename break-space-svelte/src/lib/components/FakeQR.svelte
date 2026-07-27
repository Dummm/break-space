<script>
  // Placeholder QR pattern for prototyping only. In production, replace
  // with a real QR-generation library (e.g. `qrcode` or `qrcode-svg`)
  // fed the actual identity/contact-link payload.
  export let tone = 'coral'; // 'coral' (identity QR) or 'teal' (contact-link QR)

  const cells = Array.from({ length: 100 }, (_, i) => (i * 37) % 5 < 2);
  const toneMap = { coral: '#C24E2E', teal: '#1F8C7F' };
</script>

<div
  class="grid grid-cols-10 gap-[2px] w-32 h-32 p-2 bg-white rounded-lg border-[3px]"
  style="border-color: {toneMap[tone]};"
>
  {#each cells as filled, i}
    <div class="rounded-[1px]" style="background: {filled ? toneMap[tone] : 'transparent'};" />
  {/each}
</div>
