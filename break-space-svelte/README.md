# break-space — Svelte translation

Svelte + Tailwind translation of the React prototypes, organized per the
workflow agreed in `break-space-spec.md` §11: atoms → molecules → app/
screen templates, with Storybook stories alongside each.

## Structure

```
src/lib/
  theme/
    themes.js         — the 3 theme token sets (Bubblegum, Arcade, Terminal)
    themeStore.js      — Svelte store: current theme name + derived CSS vars
  components/          — atoms & molecules
    PressButton.svelte / GhostButton.svelte
    ThemeSwitcher.svelte
    WindowCard.svelte        (onboarding-style window chrome, Stage 1/2)
    AppWindow.svelte         (tiled desktop window w/ tabs + close, Stage 3)
    AppIcon.svelte           (taskbar launcher icon)
    MountRow.svelte          (toggleable workspace mount row)
    SessionMountCard.svelte  (identity/chat session mount selector)
    FileManagerPanel.svelte  (drive sidebar, search, toolbar, .bs toggle,
                              multi-select + delete, new folder)
    FakeQR.svelte / QRCard.svelte   (placeholder QR — see Known gaps)
    AddContactModal.svelte   (show-my-QR / scan-theirs contact linking)
    Avatar.svelte / PresenceDot.svelte / ContactRow.svelte / MessageBubble.svelte
    CallOverlay.svelte       (voice/video call UI)
    ProviderCard.svelte      (connect/disconnect a sync provider)
    MountManagerRow.svelte   (per-mount status + conflict indicator)
    ConflictResolutionModal.svelte
    providerMeta.js          (provider → icon/label lookup)
  apps/                 — full app windows (rendered inside AppWindow)
    ChatApp.svelte         (contact list, thread, add-contact, calls)
    SyncManagerApp.svelte  (providers + mounts + conflict resolution)
  screens/               — onboarding-stage templates
    Stage1UserSetup.svelte
    Stage2Hello.svelte
    Stage3Desktop.svelte   (now wires in ChatApp + SyncManagerApp for real,
                            File Manager still the demo-fixture panel)
stories/                 — Storybook stories (CSF via @storybook/addon-svelte-csf)
  ThemeWrapper.svelte      — story-only helper, applies theme CSS vars
  PressButton.stories.svelte
  SessionMountCard.stories.svelte
  ContactRow.stories.svelte
  ProviderCard.stories.svelte
  Stage1UserSetup.stories.svelte
  Stage2Hello.stories.svelte
  Stage3Desktop.stories.svelte
  ChatApp.stories.svelte
  SyncManagerApp.stories.svelte
.storybook/
  main.js
  preview.js
```

## How theming works

Every color in every component resolves to a CSS custom property —
`var(--bs-coral)`, `var(--bs-text)`, etc. — rather than a hardcoded hex
value or a Tailwind color class. `themes.js` is the single source of
truth for what those variables resolve to per theme; `themeStore.js`
exposes a derived `themeCssVars` string of `--bs-*: value;` declarations.

In the real app, apply that once near the root:

```svelte
<script>
  import { themeCssVars } from '$lib/theme/themeStore.js';
</script>

<div style={$themeCssVars}>
  <!-- rest of the app -->
</div>
```

Every descendant component just references `var(--bs-*)` and inherits
whatever the root set — no component needs the theme passed down as a
prop. `<ThemeSwitcher />` writes to the shared `themeName` store, so
placing it anywhere re-themes the whole app instantly.

For Storybook, `ThemeWrapper.svelte` does the same thing per-story (each
story mounts in isolation, so it needs its own theme-applying wrapper).
It reads/writes the *same* shared store, so a `<ThemeSwitcher />` used
inside a story's content will correctly re-theme that story's wrapper.

## Setup (once you drop this into a real project)

1. Merge `package.json` dependencies into your project (see the `notes`
   field in that file — versions are unverified pins, not confirmed
   installs, since this environment can't run `npm install`).
2. Wire up Tailwind using `tailwind.config.js` + `src/app.css`.
3. `npm run storybook` to browse components in isolation.
4. Wire the screen components into your router/page structure — none of
   them currently *navigate* between stages; each screen dispatches an
   event (`continue`, `boot`) that the parent should listen for and use
   to swap screens.

## Known gaps / things to revisit

- **QR codes are placeholders.** `FakeQR.svelte` / `QRCard.svelte` draw a
  static pseudo-pattern, not a real QR code — both the identity QR
  (Stage 1) and the contact-link QR (`AddContactModal`). Swap in a real
  QR-generation library (e.g. `qrcode` or `qrcode-svg`) fed the actual
  payload before this ships.
- **Presence is hardcoded fixture data.** `ChatApp`'s contacts have a
  static `online` boolean — wire `PresenceDot` to the real ephemeral
  in-memory presence map from the signaling server (spec §4.5).
- **Window tiling is capped at 2 windows** in `Stage3Desktop.svelte`. A
  real tiling window manager (arbitrary grid, drag-to-resize) is bigger
  scope than what's been designed so far — see spec §8 open questions.
- **File Manager: no drag-drop or right-click context menu yet.**
  Search, new-folder, multi-select + delete, and the `.bs` visibility
  toggle are in; drag-drop move/copy and a context menu (rename, etc.)
  are still open, per the original next-steps list.
- **Sync conflict resolution is a two-button stub.** `ConflictResolutionModal`
  lets you pick "keep local" / "keep remote" but doesn't show an actual
  diff — real conflict UX likely needs to show *what* differs.
- **`className` prop naming** on `PressButton`/`GhostButton` mirrors the
  original React prototype for a faithful translation, but isn't
  idiomatic Svelte — consider forwarding `class` via `$$restProps`
  instead, if you want this to feel more native.
- **Not run/compiled.** All of this was hand-translated/hand-written
  without an actual Svelte or Storybook runtime available in the
  authoring sandbox — expect to fix small syntax issues on first real
  build.
- **Call UI has no real WebRTC wiring** — `CallOverlay` is a static UI
  shell (mute/camera toggle, hangup button), no actual media stream.

## Where this maps back to the spec

- Theme system → §11 (workflow decision to theme from the start)
- `SessionMountCard` → §4.4 (chat sync model, session mount)
- `AddContactModal` → §4.3 (two distinct QR types, kept visually separate)
- `FileManagerPanel`'s `.bs` toggle → §5.4 (visible dotfile-style)
- `Stage2Hello`'s mount list → §5.5 (mount addressing scheme)
- `SyncManagerApp` → §5, §5.4 (mount manager, per-mount conflict state)
- `Stage3Desktop` taskbar/tiling → §3, §7 (core UI paradigm, built-in apps)
- `ChatApp` / `CallOverlay` → §4.4, §7 (chat scope, v1 chat features)
