<script>
  import {
    Key, QrCode, Upload, ShieldAlert, Check, ArrowRight, ArrowLeft,
    Eye, EyeOff, User, Download, Sparkles,
  } from 'lucide-svelte';
  import WindowCard from '../components/WindowCard.svelte';
  import PressButton from '../components/PressButton.svelte';
  import GhostButton from '../components/GhostButton.svelte';
  import FakeQR from '../components/FakeQR.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let screen = 'welcome';
  let usePassphrase = false;
  let passphrase = '';
  let showPassphrase = false;
  let restoreMethod = 'upload';
  let keyConfirmed = false;

  function reset() {
    screen = 'welcome';
    usePassphrase = false;
    passphrase = '';
    keyConfirmed = false;
  }

  // Fired when the user is ready to move on to Stage 2 (Hello screen).
  // The parent app should navigate on this event.
  function continueToHello() {
    dispatch('continue');
  }
</script>

<div class="min-h-[600px] w-full flex items-center justify-center p-6" style="background: var(--bs-chassis);">
  <div class="w-full">
    {#if screen === 'welcome'}
      <WindowCard title="break-space — user setup">
        <div class="text-center mb-6">
          <div
            class="inline-flex items-center justify-center w-16 h-16 rounded-2xl border-[3px] mb-4"
            style="background: var(--bs-coral); border-color: var(--bs-coralBorder); box-shadow: inset 0 2px 0 rgba(255,255,255,0.5);"
          >
            <Sparkles size={28} style="color: var(--bs-coralText);" />
          </div>
          <h1 class="text-2xl font-extrabold" style="color: var(--bs-text);">Welcome to break-space</h1>
          <p class="text-sm mt-1" style="color: var(--bs-textMuted);">
            Your identity is separate from your files. Set it up now, or explore first.
          </p>
        </div>

        <div class="space-y-3">
          <PressButton tone="coral" className="w-full" on:click={() => (screen = 'create-passphrase')}>
            <Key size={18} /> Create new identity
          </PressButton>
          <PressButton tone="teal" className="w-full" on:click={() => (screen = 'restore')}>
            <Upload size={18} /> Restore with existing key
          </PressButton>
          <GhostButton className="w-full justify-center" on:click={() => (screen = 'guest-done')}>
            Continue as guest <ArrowRight size={16} />
          </GhostButton>
        </div>

        <p class="text-xs text-center mt-6" style="color: var(--bs-textFaint);">
          You can always create or restore an identity later from the taskbar.
        </p>
      </WindowCard>
    {/if}

    {#if screen === 'create-passphrase'}
      <WindowCard title="break-space — create identity">
        <p class="text-xs font-bold uppercase tracking-wider mb-2" style="color: var(--bs-textFaint);">
          Step 1 of 3 — protect your key
        </p>
        <h2 class="text-xl font-bold mb-2" style="color: var(--bs-text);">Add a passphrase?</h2>
        <p class="text-sm mb-5" style="color: var(--bs-textMuted);">
          Optional. A passphrase encrypts your private key file so it's useless without it. There's no
          way to recover a lost passphrase or key — so keep both somewhere safe.
        </p>

        <div class="space-y-3 mb-5">
          <button
            on:click={() => (usePassphrase = false)}
            class="w-full text-left rounded-xl border-[3px] px-4 py-3 transition"
            style="
              background: {!usePassphrase ? '#FFF6E8' : 'var(--bs-cardBg)'};
              border-color: {!usePassphrase ? 'var(--bs-yellowBorder)' : 'var(--bs-cardBorder)'};
            "
          >
            <span class="font-semibold" style="color: var(--bs-text);">No passphrase</span>
            <p class="text-xs" style="color: var(--bs-textFaint);">Simplest. Anyone with the key file can use it.</p>
          </button>
          <button
            on:click={() => (usePassphrase = true)}
            class="w-full text-left rounded-xl border-[3px] px-4 py-3 transition"
            style="
              background: {usePassphrase ? '#FFF6E8' : 'var(--bs-cardBg)'};
              border-color: {usePassphrase ? 'var(--bs-yellowBorder)' : 'var(--bs-cardBorder)'};
            "
          >
            <span class="font-semibold" style="color: var(--bs-text);">Encrypt with passphrase</span>
            <p class="text-xs" style="color: var(--bs-textFaint);">Recommended if others could access this file.</p>
          </button>
        </div>

        {#if usePassphrase}
          <div class="mb-5">
            <label class="text-xs font-bold uppercase tracking-wider" style="color: var(--bs-textFaint);" for="passphrase-input">
              Passphrase
            </label>
            <div class="relative mt-1">
              <input
                id="passphrase-input"
                type={showPassphrase ? 'text' : 'password'}
                bind:value={passphrase}
                placeholder="Enter a passphrase"
                class="w-full border-[3px] rounded-xl px-4 py-2.5 pr-11 focus:outline-none"
                style="border-color: var(--bs-cardBorder); background: var(--bs-cardBg); color: var(--bs-text);"
              />
              <button
                on:click={() => (showPassphrase = !showPassphrase)}
                class="absolute right-3 top-1/2 -translate-y-1/2"
                style="color: var(--bs-textFaint);"
                aria-label="Toggle passphrase visibility"
              >
                <svelte:component this={showPassphrase ? EyeOff : Eye} size={18} />
              </button>
            </div>
          </div>
        {/if}

        <div class="flex gap-3">
          <GhostButton on:click={() => (screen = 'welcome')}>
            <ArrowLeft size={16} /> Back
          </GhostButton>
          <PressButton
            tone="coral"
            className="flex-1"
            disabled={usePassphrase && passphrase.length === 0}
            on:click={() => (screen = 'create-reveal')}
          >
            Continue <ArrowRight size={16} />
          </PressButton>
        </div>
      </WindowCard>
    {/if}

    {#if screen === 'create-reveal'}
      <WindowCard title="break-space — create identity">
        <p class="text-xs font-bold uppercase tracking-wider mb-2" style="color: var(--bs-textFaint);">
          Step 2 of 3 — save your key
        </p>

        <div class="flex items-start gap-3 rounded-xl px-4 py-3 mb-5 border-[3px]" style="background: #FFEDEA; border-color: #E0866B;">
          <ShieldAlert size={20} class="shrink-0 mt-0.5" style="color: var(--bs-coralBorder);" />
          <p class="text-sm" style="color: #7A2E1A;">
            This is your only copy. Anyone with this file or QR can act as you.
            Store it somewhere safe — <strong>break-space cannot recover it if lost.</strong>
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-5">
          <div class="rounded-xl border-[3px] p-4 flex flex-col items-center justify-center" style="background: var(--bs-cardBg); border-color: var(--bs-cardBorder);">
            <Key size={28} style="color: var(--bs-yellowBorder);" class="mb-2" />
            <p class="text-xs font-mono break-all text-center" style="color: var(--bs-textMuted);">
              identity-4f21a9c.key
            </p>
            <PressButton tone="yellow" className="mt-3 w-full text-sm px-3 py-2">
              <Download size={14} /> Download
            </PressButton>
          </div>
          <div class="rounded-xl border-[3px] p-4 flex flex-col items-center justify-center" style="background: var(--bs-cardBg); border-color: var(--bs-cardBorder);">
            <FakeQR tone="coral" />
            <span class="text-[10px] mt-2 font-bold uppercase tracking-wide" style="color: var(--bs-coralBorder);">
              Identity QR — high sensitivity
            </span>
          </div>
        </div>

        <label class="flex items-start gap-2 mb-5 cursor-pointer">
          <input type="checkbox" bind:checked={keyConfirmed} class="mt-1" />
          <span class="text-sm" style="color: var(--bs-textMuted);">
            I've saved my key file and understand it can't be recovered if lost.
          </span>
        </label>

        <div class="flex gap-3">
          <GhostButton on:click={() => (screen = 'create-passphrase')}>
            <ArrowLeft size={16} /> Back
          </GhostButton>
          <PressButton tone="coral" className="flex-1" disabled={!keyConfirmed} on:click={() => (screen = 'create-done')}>
            Continue <ArrowRight size={16} />
          </PressButton>
        </div>
      </WindowCard>
    {/if}

    {#if screen === 'create-done'}
      <WindowCard title="break-space — identity ready">
        <div class="text-center py-4">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl border-[3px] mb-4" style="background: var(--bs-teal); border-color: var(--bs-tealBorder);">
            <Check size={28} style="color: var(--bs-tealText);" />
          </div>
          <h2 class="text-xl font-bold mb-1" style="color: var(--bs-text);">Identity created</h2>
          <p class="text-sm mb-6" style="color: var(--bs-textMuted);">
            Next, you'll choose what to load on the Hello screen.
          </p>
          <PressButton tone="teal" className="w-full" on:click={continueToHello}>
            Continue to Hello screen <ArrowRight size={16} />
          </PressButton>
        </div>
      </WindowCard>
    {/if}

    {#if screen === 'restore'}
      <WindowCard title="break-space — restore identity">
        <p class="text-xs font-bold uppercase tracking-wider mb-2" style="color: var(--bs-textFaint);">
          Restore with an existing key
        </p>
        <h2 class="text-xl font-bold mb-4" style="color: var(--bs-text);">How would you like to restore?</h2>

        <div class="flex gap-2 mb-5 rounded-xl p-1 border-[3px]" style="background: var(--bs-panel); border-color: var(--bs-cardBorder);">
          <button
            on:click={() => (restoreMethod = 'upload')}
            class="flex-1 rounded-lg py-2 text-sm font-semibold transition"
            style="background: {restoreMethod === 'upload' ? 'var(--bs-cardBg)' : 'transparent'}; color: {restoreMethod === 'upload' ? 'var(--bs-text)' : 'var(--bs-textFaint)'};"
          >
            Upload key file
          </button>
          <button
            on:click={() => (restoreMethod = 'qr')}
            class="flex-1 rounded-lg py-2 text-sm font-semibold transition"
            style="background: {restoreMethod === 'qr' ? 'var(--bs-cardBg)' : 'transparent'}; color: {restoreMethod === 'qr' ? 'var(--bs-text)' : 'var(--bs-textFaint)'};"
          >
            Scan QR
          </button>
        </div>

        {#if restoreMethod === 'upload'}
          <div class="border-[3px] border-dashed rounded-xl py-10 text-center mb-5" style="border-color: var(--bs-cardBorder); background: var(--bs-cardBg);">
            <Upload class="mx-auto mb-2" size={26} style="color: var(--bs-textFaint);" />
            <p class="text-sm" style="color: var(--bs-textMuted);">Drop your key file here, or click to browse</p>
          </div>
        {:else}
          <div class="border-[3px] rounded-xl py-8 text-center mb-5 flex flex-col items-center" style="border-color: var(--bs-cardBorder); background: var(--bs-cardBg);">
            <QrCode class="mb-2" size={26} style="color: var(--bs-textFaint);" />
            <p class="text-sm" style="color: var(--bs-textMuted);">Point your camera at the identity QR</p>
          </div>
        {/if}

        <p class="text-xs mb-5" style="color: var(--bs-textFaint);">
          Note: restoring your key brings back <em>who you are</em>. Contacts and chat history only
          come back if they were synced to a workspace you also restore.
        </p>

        <div class="flex gap-3">
          <GhostButton on:click={() => (screen = 'welcome')}>
            <ArrowLeft size={16} /> Back
          </GhostButton>
          <PressButton tone="teal" className="flex-1" on:click={() => (screen = 'restore-done')}>
            Verify &amp; continue <ArrowRight size={16} />
          </PressButton>
        </div>
      </WindowCard>
    {/if}

    {#if screen === 'restore-done'}
      <WindowCard title="break-space — welcome back">
        <div class="text-center py-4">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl border-[3px] mb-4" style="background: var(--bs-teal); border-color: var(--bs-tealBorder);">
            <Check size={28} style="color: var(--bs-tealText);" />
          </div>
          <h2 class="text-xl font-bold mb-1" style="color: var(--bs-text);">Identity verified</h2>
          <p class="text-sm mb-6" style="color: var(--bs-textMuted);">
            Continue to the Hello screen to load your workspaces.
          </p>
          <PressButton tone="teal" className="w-full" on:click={continueToHello}>
            Continue to Hello screen <ArrowRight size={16} />
          </PressButton>
        </div>
      </WindowCard>
    {/if}

    {#if screen === 'guest-done'}
      <WindowCard title="break-space — guest mode">
        <div class="text-center py-4">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl border-[3px] mb-4" style="background: var(--bs-grape); border-color: var(--bs-grapeBorder);">
            <User size={28} style="color: var(--bs-grapeText);" />
          </div>
          <h2 class="text-xl font-bold mb-1" style="color: var(--bs-text);">Browsing as a guest</h2>
          <p class="text-sm mb-6" style="color: var(--bs-textMuted);">
            You can look around freely. We'll ask you to sign in only if you try to write, mount a
            private workspace, or open Chat.
          </p>
          <PressButton tone="grape" className="w-full" on:click={continueToHello}>
            Continue to Hello screen <ArrowRight size={16} />
          </PressButton>
        </div>
      </WindowCard>
    {/if}
  </div>
</div>
