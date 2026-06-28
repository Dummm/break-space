# break-space

## Overview

A **static-first web workspace** built with **SvelteKit**. The application manages authentication and workspace metadata while delegating user content storage to external providers through a pluggable storage abstraction.

The application should be deployable as a static site with no required backend for core functionality.

---

## Core Principles

- Static-first architecture
- Offline-first where possible
- Client-side processing
- Privacy-focused
- Vendor-neutral storage
- Modular integration architecture
- Type-safe (TypeScript)
- Progressive Web App (PWA)

---

## Tech Stack

| Component       | Technology             |
| --------------- | ---------------------- |
| Framework       | SvelteKit              |
| Language        | TypeScript             |
| Build Tool      | Vite                   |
| Package Manager | pnpm                   |
| Runtime         | Node.js 24             |
| Styling         | Tailwind CSS (planned) |
| State           | Svelte stores / runes  |
| Local Database  | IndexedDB (Dexie)      |
| Authentication  | OAuth2 + PKCE          |
| CI/CD           | GitLab CI              |
| Hosting         | GitLab Pages           |
| Testing         | Vitest + Playwright    |
| Linting         | ESLint                 |
| Formatting      | Prettier               |

---

## Storage Philosophy

The application stores **only**:

- user profile
- authentication state
- provider configuration
- workspace preferences
- cached metadata

User-generated content should never be stored on application infrastructure.

Content is synchronized through storage providers.

Initial providers:

- GitHub
- GitLab
- Google Drive
- Arweave

Future providers:

- OneDrive
- Dropbox
- WebDAV
- S3-compatible storage
- Backblaze B2
- Cloudflare R2
- IPFS
- Local File System Access API

---

## High-Level Architecture

```
Browser
    │
    ▼
SvelteKit App
    │
    ├── Auth
    ├── Workspace
    ├── IndexedDB Cache
    ├── Sync Engine
    └── Storage Adapters
            │
            ├── GitHub
            ├── GitLab
            ├── Google Drive
            ├── Arweave
            └── Future Providers
```

---

## Design Goals

- Storage providers are interchangeable.
- Providers implement a common interface.
- UI must not depend on provider-specific APIs.
- Synchronization is asynchronous.
- Local cache is the primary working copy.
- Remote storage acts as synchronization target.

---

## Suggested Project Structure

```
src/
    lib/
        auth/
        storage/
            adapters/
            interfaces/
            sync/
        workspace/
        database/
        ui/
        utils/

    routes/

    stores/

    workers/
```

---

## Coding Guidelines

- Prefer composition over inheritance.
- Avoid unnecessary abstractions.
- Keep components small.
- Prefer immutable data.
- Strong typing over `any`.
- Validate external data with Zod.
- No business logic inside UI components.
- Keep storage providers isolated.

---

## Agent Guidelines

When modifying the project:

- Preserve static-site compatibility.
- Do not introduce mandatory backend dependencies.
- Keep provider implementations independent.
- Maintain strict TypeScript types.
- Favor browser-native APIs.
- Consider offline behavior.
- Minimize bundle size.
- Prefer standards over proprietary solutions.

When proposing new features:

1. Is it static compatible?
2. Does it work offline?
3. Can it be provider-agnostic?
4. Does it preserve user ownership of data?
5. Does it increase bundle size significantly?

---

## Long-Term Vision

Create a browser-based workspace platform where users own their data and can seamlessly switch between storage providers without vendor lock-in.

---

## GitHub Auth PoC - Completed ✓

### Architecture: Static-First (Client-Side Only)

The PoC implements **client-side only authentication** to maintain static-site compatibility:

- **No database required** for auth layer
- **Session storage**: browser localStorage (survives page reloads within session)
- **OAuth flow**: GitHub OAuth2 + PKCE standard
- **Server role**: Minimal (token exchange only)
- **User data**: Cached client-side from GitHub API
- **Deployment**: Compatible with static hosting (GitLab Pages, GitHub Pages, etc.)

### Implementation Status

**Completed ✓**

| Component | Status | Location |
|-----------|--------|----------|
| Client auth store | ✓ Complete | [src/lib/auth/store.ts](src/lib/auth/store.ts) |
| OAuth callback handler | ✓ Complete | [src/routes/auth/github/callback/+server.ts](src/routes/auth/github/callback/+server.ts) |
| Callback UI handler | ✓ Complete | [src/routes/auth/github/callback/+page.svelte](src/routes/auth/github/callback/+page.svelte) |
| GitHub sign-in button | ✓ Complete | [src/routes/demo/better-auth/login/+page.svelte](src/routes/demo/better-auth/login/+page.svelte) |
| Protected auth view | ✓ Complete | [src/routes/demo/better-auth/+page.svelte](src/routes/demo/better-auth/+page.svelte) |
| Regression tests | ✓ Passing | [src/lib/auth/callback.test.ts](src/lib/auth/callback.test.ts) (2/2 passing) |
| Type checks | ✓ Passing | `pnpm check` returns 0 errors |

### How the Flow Works

```
1. User → "Sign in with GitHub" button
                    ↓
2. Browser → GitHub OAuth authorization endpoint (with PKCE challenge)
                    ↓
3. User approves scope, GitHub redirects with authorization code
                    ↓
4. Browser → /auth/github/callback?code=...
                    ↓
5. Server endpoint exchanges code for access token (no DB)
                    ↓
6. Server fetches user profile from GitHub API
                    ↓
7. Browser stores session in localStorage (client-side store)
                    ↓
8. User redirected to authenticated page, profile displayed
```

### Configuration

**Environment variables** (in .env):
```
ORIGIN=http://localhost:5173
GITHUB_CLIENT_ID=<your-client-id>
GITHUB_CLIENT_SECRET=<your-client-secret>
```

**GitHub OAuth app settings**:
- Authorization callback URL: `http://localhost:5173/auth/github/callback`

### Design Decisions

| Decision | Rationale |
|----------|-----------|
| No database for auth | Maintains static-site compatibility |
| localStorage for session | Simple, survives page reloads, good for PoC |
| Client-side store | Reactive, integrates cleanly with Svelte runes |
| Minimal server endpoint | Reduces backend requirements |
| OAuth2 + PKCE | Industry standard, secure for SPAs |
| GitHub API for profile | No intermediate storage needed |

### Known Limitations (Acceptable for PoC)

- Session lost when browser storage cleared
- No persistence across devices/browsers
- No server-side rate limiting on profile fetches
- Token stored in localStorage (future: consider httpOnly cookies with backend)
- No refresh token rotation (acceptable for GitHub personal tokens)

---

## Development Roadmap

### Phase 1: Storage Provider Abstraction (Ready Now)

**Goal**: Implement pluggable storage adapter interface so users can store content on GitHub, GitLab, Google Drive, or other providers.

**Scope**:
- Define `StorageProvider` interface (read, write, delete, list operations)
- Create GitHub storage adapter (read/write files to GitHub repo)
- Create IndexedDB local cache adapter (offline-first caching)
- Implement adapter selection UI (let users choose storage)
- Add configuration/credentials storage in localStorage

**Deliverables**:
- [ ] `src/lib/storage/interfaces/Provider.ts` — common interface
- [ ] `src/lib/storage/adapters/GitHubAdapter.ts` — GitHub operations
- [ ] `src/lib/storage/adapters/IndexedDBAdapter.ts` — local cache
- [ ] `src/lib/storage/StorageManager.ts` — adapter registry & selection
- [ ] `src/routes/demo/storage/+page.svelte` — provider selection UI

**Technical Notes**:
- Use GitHub API v3 for file operations
- Implement CRUD operations: read, write, delete, list
- Store provider credentials securely (encrypted localStorage for PoC)
- Test with mock provider for rapid iteration

**Estimated effort**: 2-3 weeks

---

### Phase 2: Workspace Management

**Goal**: Allow users to manage workspaces with settings, metadata, and provider configuration.

**Scope**:
- Create `Workspace` data model (name, description, provider, settings)
- Implement workspace store (CRUD operations)
- Add workspace switching UI
- Link auth sessions to workspaces
- Support multiple workspaces per user

**Deliverables**:
- [ ] `src/lib/workspace/types.ts` — data models
- [ ] `src/lib/workspace/store.ts` — workspace state management
- [ ] `src/lib/workspace/WorkspaceManager.ts` — business logic
- [ ] `src/routes/workspaces/+page.svelte` — workspace list
- [ ] `src/routes/workspaces/[id]/settings/+page.svelte` — workspace config

**Technical Notes**:
- Store workspace list in localStorage (sync to provider later)
- Each workspace has independent storage provider config
- Current workspace stored in session

**Estimated effort**: 1-2 weeks

---

### Phase 3: Sync Engine

**Goal**: Synchronize local cache (IndexedDB) with remote storage providers asynchronously.

**Scope**:
- Implement conflict resolution strategy
- Create background sync queue
- Handle offline/online transitions
- Support incremental sync
- Add sync status UI (pending, syncing, synced, error)

**Deliverables**:
- [ ] `src/lib/sync/SyncEngine.ts` — core sync logic
- [ ] `src/lib/sync/ConflictResolver.ts` — conflict strategies
- [ ] `src/lib/sync/Queue.ts` — pending operations queue
- [ ] `src/lib/sync/hooks.ts` — integration with Svelte lifecycle
- [ ] `src/routes/demo/sync/+page.svelte` — sync status UI

**Technical Notes**:
- Use IndexedDB transactions for atomicity
- Implement optimistic updates (update local, queue remote)
- Handle network failures gracefully
- Metadata tracking: last sync timestamp, etags, version hashes

**Estimated effort**: 3-4 weeks

---

### Phase 4: Progressive Web App (PWA) Setup

**Goal**: Enable offline-first app experience with service worker and install prompts.

**Scope**:
- Create service worker for caching strategy
- Generate app manifest
- Add install prompts
- Implement offline fallback pages
- Cache static assets and API responses

**Deliverables**:
- [ ] `src/service-worker.ts` — service worker
- [ ] `static/manifest.json` — PWA manifest
- [ ] `src/lib/pwa/install.ts` — install prompt handling
- [ ] Cache strategy configuration in `vite.config.ts`

**Technical Notes**:
- Use Vite's built-in PWA plugin (if available)
- Cache-first for static assets, network-first for API
- Stale-while-revalidate for sync data
- Deep linking support for workspace routes

**Estimated effort**: 1-2 weeks

---

### Phase 5: Additional Storage Providers

**Goal**: Expand storage options beyond GitHub.

**Scope**:
- GitLab storage adapter
- Google Drive adapter
- Arweave adapter (decentralized)
- WebDAV adapter
- Future: Dropbox, OneDrive, S3, IPFS

**Technical Notes**:
- Each adapter follows same `StorageProvider` interface
- OAuth flows for each provider
- Handle provider-specific rate limits and quotas
- Provider capabilities matrix (read/write/delete/versions)

**Estimated effort**: 2-3 weeks per provider

---

### Phase 6: Rich Editor & Workspace UX

**Goal**: Build intuitive UI for creating, editing, and organizing content.

**Scope**:
- File browser/explorer component
- Markdown editor with preview
- File upload/drag-drop
- Breadcrumb navigation
- Search across workspace
- Tagging/organization system

**Deliverables**:
- [ ] `src/lib/components/FileBrowser.svelte`
- [ ] `src/lib/components/Editor.svelte`
- [ ] `src/lib/components/Search.svelte`
- [ ] `src/routes/workspace/[id]/+page.svelte` — main workspace view

**Estimated effort**: 4-6 weeks

---

### Phase 7: Collaboration Features (Future)

**Goal**: Enable real-time collaboration and sharing.

**Scope**:
- Share workspaces/files with others
- Read-only links
- Comments and annotations
- Real-time cursors (WebSocket)
- Operational transformation for concurrent edits

**Technical Notes**:
- Requires minimal backend (WebSocket server for real-time)
- Breaks static-site constraint; optional backend
- Use existing sync engine as foundation

**Estimated effort**: 6-8 weeks

---

## Success Criteria

Each phase should:
1. ✓ Maintain static-site deployability (except Phase 7)
2. ✓ Work offline-first with graceful degradation
3. ✓ Pass type checks (`pnpm check`)
4. ✓ Include unit tests (Vitest)
5. ✓ Include E2E tests (Playwright)
6. ✓ Not increase bundle size significantly
7. ✓ Use browser-native APIs where possible
8. ✓ Preserve user data ownership

---

## Current Task Queue

**Immediate**:
1. ✓ GitHub auth PoC working
2. Start Phase 1: Storage Provider Abstraction
   - Define StorageProvider interface
   - Implement GitHub adapter
   - Create IndexedDB adapter

**Blocked/Waiting**:
- None currently

**Technical Debt**:
- Drizzle schema still present but unused (can be removed)
- Consider migrating to httpOnly cookies for token storage (requires backend)
