# break-space — UI/UX & Architecture Spec

_Living document — consolidates decisions made so far. Update as the design evolves._

---

## 1. Concept

A public, multi-tenant, **client-side "OS in the browser"**. Data lives locally in IndexedDB and is portable/syncable to external providers (GitHub, GitLab, Google, IPFS). A lightweight FastAPI backend handles **identity/auth and WebRTC signaling only** — it is not a data store for user files.

Two independent layers:
- **Identity layer** — who you are (keypair-based, server-verified, portable across everything)
- **Storage layer** — one or more **mounted workspace directories** (local IDB + optional sync provider), unrelated to identity except that identity is required to *write* to or *chat within* a workspace

---

## 2. Visual direction

Playful/retro OS aesthetic — late-90s/early-2000s desktop energy (BeOS/early iMac inspired): chunky rounded window chrome, bevels and soft shadows, candy-color accents on a neutral chassis, hand-drawn-feeling icons rather than flat corporate iconography. Should stay legible and performant — retro flavor, modern rendering.

---

## 3. Core UI paradigm

- **Desktop OS metaphor**: desktop surface with icons, taskbar/dock, window chrome
- **Window management**: tiling + tabs (not freeform overlapping)
- **Future**: optional single-pane view (Notion/VSCode-style) as an alternate mode
- **Mobile/small screens**: auto-switch to single-pane view (v1); simplified touch desktop is a future option

---

## 4. Identity layer

### 4.1 Creating/restoring identity
Handled by the FastAPI auth server. Identity is **entirely optional** — a visitor can use break-space as a guest indefinitely, browsing public workspaces, and only needs identity to write, mount a private/synced workspace, or use chat.

When the user does choose to set up identity (during onboarding or later), the client offers:
- **Create new identity** → generates a private key, offered as a downloadable file **and** a QR code
- **Authenticate with existing key** → upload key file or scan QR

### 4.2 Key handling
- Private key can **optionally** be passphrase-encrypted before download/display
- Clear warning shown before revealing/downloading the raw key or QR ("this is sensitive, don't share it")
- **No recovery if lost** — losing the key means losing that identity permanently (same philosophy as storage: recovery only via explicitly connected providers, not via the auth server). No key rotation/revocation mechanism planned — left as-is for now.

### 4.3 Two distinct QR types (must be visually/behaviorally distinguishable in UI)
| QR type | Purpose | Sensitivity |
|---|---|---|
| **Identity QR** | Login / auth with existing private key | High — leaks private key |
| **Contact-link QR** | Direct WebRTC peer linking for chat | Low — just a peer/session handshake |

These should use different colors/icons/framing in the UI so users never confuse "log in" with "add a contact."

### 4.4 Chat scope
- Chat contacts and history are **scoped to identity**, not to any mounted workspace — portable across whatever workspace(s) are currently mounted
- Identity also carries **permissions/relationship data about other identities** — contacts, trust level, blocked list, possibly additional per-contact metadata. **Decided: this is purely chat-related** (blocking/trust/contacts) — it does not extend to workspace-level access control. Stored locally alongside the identity, not on the server.
- v1 chat features: text, voice/video calls, file/media sharing over the data channel

**Decided: session mount.** Identity metadata (contacts/permissions) and chat history live in a special **session mount**, distinct from ordinary workspace mounts:
- Default location: `/idb/session` — always local, always available, not counted among the user's regular workspace mounts
- The user can **switch the session mount to point at any already-loaded workspace mount** instead (e.g. `/github/my-notes-repo`), which is how the "sync to a chosen mount" option from the chat-sync model above is actually surfaced in the UI
- Switching requires the target mount to already be loaded — the flow is **mount first, then designate it as the session mount**, not a single combined action. This keeps mounting (a storage-layer concern) and session designation (an identity-layer concern) as clearly separate steps, consistent with the identity/storage separation established in §1.
- If a returning user's session was previously pointed at a non-default mount and that mount isn't loaded, the session mount UI should surface this plainly (can't load your synced session until its mount is back), rather than silently falling back to `/idb/session`.

**Decided: chat sync model.** Users choose one of:
- **Clear on session close** — ephemeral, nothing persists between sessions (privacy-first option)
- **Sync to IDB (default)** — chat history persists locally in IndexedDB, no external mount involved
- **Sync to a chosen mount (opt-in)** — user explicitly switches the sync target to any currently active mount (local or provider-backed), using the same mount addressing as workspaces (§5.5)

**Decided: restore verification.** When pulling synced chat history back (e.g. onto a new device, or after a fresh identity restore), the sync is verified via a hash, the private key, or some combination of these plus information "known" to the user/Sync Manager (e.g. a passphrase). This is what distinguishes a bare identity restore (private key only — you're back, but nothing pulls in automatically) from a verified history restore (key + hash/known-info check unlocks the previously synced chat data in that mount). Exact verification scheme (which combination, how the "known" element is captured/stored) still needs a focused design pass.

### 4.5 FastAPI server responsibilities — statefulness

**Decided: ephemeral in-memory presence.** The server verifies signatures and relays WebRTC signaling (offer/answer/ICE), and keeps a short-lived, in-memory (not persisted to disk/DB) map of `pubkey → active connection`, cleared on disconnect. This gives a basic online/offline indicator and reliable signaling delivery, while nothing survives a server restart or gets written to durable storage — it's routing state, not a user record, so it doesn't compromise the "we don't store your stuff" positioning.

Implementation detail (TTL length, reconnection/grace-period behavior, what happens on server restart mid-session) still needs its own deep-dive — flagged separately in §8.

### 4.6 Multi-device sessions
- **v1**: each device tracks its own session locally via web storage (e.g. `localStorage`/IndexedDB) — no server-side device list, no cross-device awareness
- **Future direction**: sync session/presence state directly device-to-device via WebRTC or local network (e.g. LAN/mDNS-style discovery) rather than through the server — keeps the "no central record of your devices" posture intact while still enabling a multi-device feel later

---

## 5. Storage / workspace layer

### 5.1 Mount model
Workspaces are **mounted like directories/drives**, not "the one open workspace." A user can have **multiple workspaces mounted simultaneously** — e.g. their personal workspace plus a couple of public repos they're browsing, all visible at once in the File Manager (conceptually similar to a "Volumes" or "This PC" view listing multiple drives).

- Each mount is independent: its own provider connection (or none, for local-only), its own sync state, its own `.bs` metadata
- File Manager should present mounted workspaces as top-level entries (like drives/volumes), each expandable into its own directory tree
- Unmounting a workspace doesn't delete local data by default — same non-destructive posture as the rest of the storage model

### 5.2 Workspace types
- **Personal** — user's own local/synced workspace
- **Public** — repos, cloud folders, or archives others can browse

### 5.3 Access rules
- **Anonymous browsing allowed** for public workspaces — no identity required to just look
- **Identity required** to write/edit a workspace, or to use chat within it

### 5.4 `.bs` metadata folder
- **Visible, dotfile-style** — shown in File Manager the same way `.git` would be (hidden by default under a "show hidden files" toggle, but not fully inaccessible)
- **Scoped per mount**: each mounted directory carries its own `.bs`, storing the sync/provider metadata relevant to *that specific mount* (which provider, sync state, last-synced revision, conflict markers, etc.) — there's no single global sync config; every mount manages its own

### 5.5 Mount addressing scheme

**Decided:** each provider type is a namespace that can hold multiple independent mounts:

```
/{idb, gdrive, github, gitlab, ipfs, ...}/<workspace-or-mount-name>/**
```

Examples: `/idb/personal`, `/idb/scratch-notes`, `/github/my-repo`, `/github/some-public-repo`, `/gdrive/design-assets`. This resolves the earlier "one provider vs. multi-provider" question at the addressing level — a single provider (including local IDB) can have many independent mounts side by side, each with its own `.bs`. Local-only (IDB) workspaces follow the same multi-mount model as provider-backed ones — a user can have several separate local workspaces, not just one.

### 5.6 Sync providers
GitHub, GitLab, Google Drive, IPFS (extensible). Managed via the **Sync Manager** app, which now doubles as the **mount manager** — connect a provider, mount/unmount a directory, view sync status & conflicts per mount.

---

## 6. Onboarding flow (revised — three stages, everything optional)

**Decided structure:** User Setup → Hello screen ("boot-up") → Main app/OS. No step is mandatory; the user should be free to explore. Every meaningful choice (identity, provider connections, mounts) can be deferred and completed later from within the app itself.

### Stage 1 — User Setup (optional)
- **Continue as guest** / **Create new identity** / **Restore with existing key**
- This stage is about identity and provider *connections* only — no mounts are selected yet
- If skipped/guest: recorded in local cache/web storage so the app doesn't re-prompt every visit
- Guest users can browse public workspaces freely; attempting to write, mount a private workspace, or open Chat triggers the identity prompt in-context later, not a redirect back here

### Stage 2 — Hello screen ("boot-up")
Conceptually similar to an OS boot/login screen that lets you pick what to load:
- **New user**: a default local `/idb/hello` directory is pre-mounted and offered, alongside the option to mount something else (new local workspace, connect a provider, browse public)
- **Returning user**: their previously stored mount configuration is presented here (which mounts were active last time), ready to "boot" back into — but editable, since a user can manage multiple local (IDB) workspaces the same way they can manage multiple mounts from any other provider
- This is where actual mount selection happens (see §5.5 addressing scheme) — Setup handled *who you are*, Hello handles *what you're loading*
- **Session mount shown first, separately from workspace mounts**: a dedicated card for `/idb/session` (or wherever the user has pointed it) sits above the regular mount list, with its own "switch" control restricted to mounts already loaded in this session — reinforcing that identity/chat data and workspace data are handled through parallel but distinct mechanisms
- A "boot"/"load" action confirms the selection and transitions into the desktop

### Stage 3 — Main app / Desktop
- Nickname prompt (lightweight, editable later, defaults to something auto-generated) — the only thing that's effectively "always asked," and even this is edit-anytime, not a hard gate
- Default apps pinned: File Manager, Chat, Sync Manager, Help
- File Manager reflects whatever was loaded at the Hello screen (default `/idb/hello` for new users, or the restored mount set for returning ones)
- Gentle non-blocking nudges (toast + quiet badge on Sync Manager) for anything not yet connected, rather than blocking modals
- No forced tutorial — Help app available anytime instead

### 6.1 Resuming deferred choices
Since identity and mounts are both skippable at Setup, the UI needs clear, low-friction re-entry points at any time:
- A persistent (but unobtrusive) "Sign in" affordance in the taskbar/system tray for guests
- A "Mount workspace" action always available in File Manager / Sync Manager, not just at the Hello screen
- Cached setup-skip state should not nag repeatedly — one quiet indicator per deferred item is enough

### 6.2 Anonymous entry point
A visitor can land on a **public workspace URL directly**, which effectively skips Setup and Hello and drops them straight into the desktop with that one public mount loaded. Identity creation is only triggered if/when they try to write, comment, or chat.

---

## 7. Built-in apps (v1)

1. **File Manager** — single window with a **drive-list sidebar** listing all active mounts (v1 approach), browse mounted workspace(s), CRUD, drag-drop, move/copy, mount/unmount drives
2. **Text/Code Editor** — open files, syntax highlighting for common types
3. **Media Viewer** — image/video/audio preview
4. **Sync Manager** — connect providers, mount/unmount directories, view sync status & conflicts per mount
5. **Chat** — identity-scoped contacts, text/voice/video, QR-based peer linking
6. **Help** — replaces forced tutorial; searchable reference
7. **Browser** — tabbed viewer for external sites and rendered HTML from any mount (see §7.1 below)

---

## 7.1 Browser app

A built-in app for viewing content outside the user's own workspaces — external sites (e.g. Neocities pages) and rendered HTML sitting inside any mounted workspace. Same window, same tab model, two content sources.

### 7.1.1 Tab model

Every tab is one of two source kinds, but shares a single shape so tab management, history, and the address bar are built once:

```
BrowserTab {
  id
  addressInput: string
  source: { kind: 'external', url } | { kind: 'mount', path }   // path uses §5.5 addressing
  title, favicon
  history: [{ url, title, ts }], historyIndex
  viewMode: 'render' | 'source' | 'blocked'
  sandbox: string[]
}
```

**Decided:** the address bar takes a single string and resolves it through a chain of resolvers (mount path → local rendering, bare URL → external embed, later: search query → a discovery source). New content sources are added as resolvers, not as special-cased app modes.

### 7.1.2 External embeds

- Rendered in a sandboxed `<iframe>`, no `allow-same-origin` by default
- Some sites will refuse to embed (frame-busting scripts, strict CSP) with no reliable JS-level error — every tab needs a load-timeout fallback to "couldn't embed this — open externally" from day one, not as a later patch
- Sits in the tiling/tabs window model established in §3

### 7.1.3 Rendering local-mount HTML

**Decided direction: Service Worker virtual origin.** A dedicated SW scope (e.g. `https://mounts.break-space.app/{provider}/{mount}/**`, mirroring §5.5) intercepts requests and serves bytes straight out of IDB. The tab just navigates normally inside its iframe — relative links, `fetch`, and workers resolve the way they would on a real static host.

Rejected alternative: rewriting relative `src`/`href`/`url()` references to generated `blob:` URLs. Simpler to build, but breaks on anything that does dynamic `fetch` or absolute-path lookups — i.e. most real sites. Not chosen because retrofitting the SW approach after tabs/history are wired to blob URLs is a bigger rewrite than starting with it.

- Each mount's rendered content lives on its own SW-controlled origin, distinct from the main app's origin — so rendered user content (even the user's own) can't reach into the parent OS's DOM
- This makes "preview my site before publishing" (relevant to a future Neocities-publish feature) and "just browse a mounted static site" the same code path

### 7.1.4 Source view

A per-tab toggle to show raw HTML as text instead of executing it — doubles as the safe fallback when embedding is blocked, and as a plain "view source" feature for local mounts.

### 7.1.5 History & bookmarks

- Scoped locally per device/identity (not chat-scoped, not workspace-scoped) — simple append-only list, cheap to add now rather than retrofit
- Bookmarks store the raw address string, resolved the same way as manual entry

### 7.1.6 Security notes

- Sandbox flags configurable per source kind (external vs. mount) so permissions can be tuned per-source without changing the Tab model later
- External and mount-rendered content are never given the main app's origin

---

## 8. Open questions / not yet resolved

- **Ephemeral presence implementation detail** (§4.5) — TTL length, reconnection/grace-period behavior. Needs its own dedicated deep-dive session, not a quick decision.
- **Device-to-device session sync** over WebRTC/local network — explicitly a **future/v2+** item, not part of v1 design work.
- **Exact chat restore-verification scheme** (§4.4) — which combination of hash/private key/known-info is used, and how the "known" element is captured and stored. Model is decided; mechanism needs a focused design pass.
- **SW virtual-origin implementation** (§7.1.3) — exact scoping/registration strategy for per-mount service workers, cache invalidation on file edits, and behavior when a mount is unmounted mid-render. Needs its own design pass before building.
- **Frame-refusal detection** (§7.1.2) — no reliable JS signal exists for "this site blocked framing"; needs a practical heuristic (timeout-based) rather than a clean detection.

---

## 9. Decision log

| Topic | Decision |
|---|---|
| UI paradigm | Desktop OS metaphor, single-pane mode planned for later |
| Audience | Public, multi-tenant |
| Chat vs. workspace priority | Workspace is the star; chat is a side feature |
| Portability | Static client, IDB local storage, syncs to GitHub/GitLab/Google/IPFS |
| Window behavior | Tiling + tabs |
| Mobile | Auto single-pane view now; touch-friendly desktop later |
| Aesthetic | Skeuomorphic/retro OS, playful |
| Chat launch scope | Text + voice/video calls |
| Apps v1 | File Manager, Editor, Media Viewer, Sync Manager, Chat, Help |
| Storage recovery | Only via connected sync provider; no recovery otherwise |
| Peer discovery | QR-based direct WebRTC linking + lightweight FastAPI signaling server |
| Onboarding minimum | Nothing required; every step (identity, workspace) is skippable and resumable later |
| Chat/contact scope | Tied to identity, portable across workspaces |
| Private key encryption | Optional passphrase, with warning before reveal/download |
| Public workspace access | Anonymous browsing allowed; identity only required to write/chat |
| Workspace model | Mount-based; multiple workspaces can be mounted simultaneously, like drives/volumes |
| `.bs` visibility | Visible, dotfile-style (like `.git`) |
| `.bs` scope | Per-mount, not global — each mounted directory has its own sync metadata |
| Mount addressing | `/{provider}/<mount-name>/**` — each provider (including local IDB) supports multiple independent mounts |
| Signaling server statefulness | Ephemeral in-memory presence map (ties to §4.5) — decided |
| Multi-device sessions | v1: local per-device session via web storage, no server tracking; future: P2P sync via WebRTC/local network |
| Key rotation/revocation | None — left as-is for now |
| Onboarding structure | Three stages: User Setup (identity/providers, no mounts) → Hello/boot screen (mount selection) → Desktop |
| File Manager v1 UI | Single window, drive-list sidebar; new users get default `/idb/hello` pre-mounted, returning users get stored mount config |
| Identity permissions data | Purely chat-related (contacts, trust, blocking) — does not extend to workspace access control |
| Chat sync model | Three options: clear on session close, sync to IDB (default), or opt-in sync to any active mount |
| Session mount | Dedicated `/idb/session` mount (default) for identity/chat data, separate from workspace mounts; switchable to any already-loaded mount, but must be loaded before it can be designated |
| Chat restore verification | Hash / private key / combination plus a user-or-Sync-Manager-known element — exact scheme still to be designed (see §8) |
| Browser app content model | Single Tab abstraction over two source kinds (external embed, local-mount render); address bar resolves via a resolver chain so new sources (search/discovery) plug in later without new app modes |
| Local-mount HTML rendering | Service Worker virtual origin per mount (mirrors §5.5 addressing), not blob-URL rewriting — chosen for real relative-path/fetch/worker support |
| Browser security posture | Sandboxed iframes for all tabs; mount-rendered content served from its own SW origin, isolated from the main app's DOM |
| Embed failure handling | Load-timeout fallback to "open externally," built in from the start rather than added later |

---

## 10. Next design steps (suggested order)

**Status: all four apps now have real Svelte components** (see `break-space-svelte.zip`). Stage 1/2/3 screens, plus `ChatApp` (contact list, threads, add-contact QR flow, call overlay) and `SyncManagerApp` (provider connections, mount list, conflict resolution) are wired into the Stage 3 taskbar/window system — no more placeholder divs for Chat/Sync Manager. File Manager gained search, new-folder, multi-select+delete. Component structure: atoms/molecules in `src/lib/components/`, full app windows in `src/lib/apps/`, onboarding screens in `src/lib/screens/`, theme tokens in `src/lib/theme/`, stories in `stories/`. Known gaps documented in that package's README (placeholder QR, no real WebRTC wiring, drag-drop/context-menu still missing from File Manager, unverified build since this environment can't run Svelte/Storybook directly).

1. ~~Wireframe **Stage 1 — User Setup**~~ ✅ prototyped + translated
2. ~~Wireframe **Stage 2 — Hello screen**~~ ✅ prototyped + translated
3. ~~Stage 3 — Desktop shell (taskbar, tiled windows, File Manager)~~ ✅ prototyped + translated
4. ~~Chat app (contact linking via QR, call UI overlay)~~ ✅ built (`ChatApp.svelte`) — presence is still fixture data, not wired to a real signaling connection
5. ~~Sync Manager / Mount Manager (provider connection, per-mount conflict resolution UX)~~ ✅ built (`SyncManagerApp.svelte`) — conflict modal is a stub without a real diff view
6. Still open: File Manager drag-drop + right-click context menu; real QR generation; real WebRTC media wiring for calls; window tiling beyond 2 panes

---

## 11. Design/dev workflow

- **Prototyping**: interactive React + Tailwind prototypes, iterated visually before any real implementation code is written
- **Production implementation**: Svelte + Tailwind CSS
- **Component development/documentation**: Storybook (`@storybook/svelte`), with stories organized by atomic pieces (buttons, badges, QR display) → composed pieces (drive-list sidebar, contact card) → full screen templates (Setup, Hello, Desktop). Each screen's various states (guest/authenticated, empty/populated mounts, new/returning user) become separate stories rather than being buried in one component.
- Suggested order: prototype a screen in React → get sign-off on layout/flow/states → translate to Svelte components with matching Storybook stories
