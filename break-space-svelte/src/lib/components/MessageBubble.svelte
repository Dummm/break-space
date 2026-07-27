<script>
  // message: { from: 'me' | 'them', text, time }
  export let message;
</script>

<div class="flex mb-2" style="justify-content: {message.from === 'me' ? 'flex-end' : 'flex-start'};">
  <div
    class="max-w-[75%] rounded-2xl px-3 py-2 border-2"
    style="
      background: {message.from === 'me' ? 'var(--bs-teal)' : 'var(--bs-cardBg)'};
      border-color: {message.from === 'me' ? 'var(--bs-tealBorder)' : 'var(--bs-cardBorder)'};
      color: {message.from === 'me' ? 'var(--bs-tealText)' : 'var(--bs-text)'};
    "
  >
    <p class="text-sm">{message.text}</p>
    <p class="text-[10px] mt-1" style="opacity: 0.7;">{message.time}</p>
  </div>
</div>
