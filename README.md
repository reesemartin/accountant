# Accountant

Accounting assistant tool monorepo. Optimized for free hosting on [Netlify](https://www.netlify.com/). Authentication is Google Sign-In and data is stored per-user in [Firestore](https://firebase.google.com/docs/firestore) (both via [Firebase](https://firebase.google.com/), on its free Spark plan).

## Packages

[Server](./packages/server/README.md)
[UI](./packages/ui/README.md)

## Installation

![node](https://img.shields.io/badge/node-v20.10.0-brightgreen.svg?style=for-the-badge)

> **Requirements**: Depending on your preferred node manager, set the required node version. NodeJS `(v.20.10.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

```bash
nvm use
```

If you haven't already installed `yarn` then `corepack enable`

```bash
yarn
```

### Local development — no Firebase project needed

Local dev runs entirely against the **Firebase Local Emulator Suite**: real local implementations of Auth and Firestore, offline, free, with no external account required. `yarn dev:server` and `yarn dev:ui` are already wired to point at them, so you don't need a real Firebase project just to develop — only for an actual deploy (see the next section).

Create a `.env.local` in the repo root with just this:

```bash
REACT_APP_API_URL=http://localhost:3001
REACT_APP_FIREBASE_API_KEY=demo-api-key
REACT_APP_FIREBASE_APP_ID=demo-app-id
REACT_APP_FIREBASE_AUTH_DOMAIN=demo-accountant.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=demo-accountant
REACT_APP_USE_FIREBASE_EMULATOR=true
```

None of these values need to be real — `demo-`-prefixed project IDs are a Firebase convention that tells both the client SDK and the emulators "don't talk to production, ever." Leave `FIREBASE_SERVICE_ACCOUNT` out of this file entirely; the server only needs it when `FIRESTORE_EMULATOR_HOST` isn't set (i.e. in production), and keeping a real service account key out of your local dev bundle is one less thing that can leak.

In three separate terminals:

```bash
yarn dev:emulators
```

```bash
yarn dev:server
```

```bash
yarn dev:ui
```

Your app is now running on [http://localhost:3000](http://localhost:3000), the server api at [http://localhost:3001](http://localhost:3001), and the emulator UI (browse/edit Firestore data, see signed-in users) at [http://localhost:4000](http://localhost:4000). Clicking "Sign in with Google" opens the emulator's fake sign-in screen instead of a real Google prompt — pick any email, no real Google account involved. Emulator data is in-memory and resets each time you stop `yarn dev:emulators`; if you want it to persist across restarts, run `firebase emulators:start --export-on-exit=./firebase-emulator-data --import=./firebase-emulator-data` instead (create that folder once first).

### Firebase project setup (for an actual deploy, ~10 minutes)

Only needed once you're ready to deploy somewhere real (e.g. Netlify) — local dev doesn't need this. Has to be done through the Firebase console (it needs your Google account):

1. Go to the [Firebase console](https://console.firebase.google.com/) and create a new project (or reuse an existing Google Cloud project).
2. **Authentication** → Sign-in method → enable the **Google** provider.
3. **Firestore Database** → Create database → start in **production mode**, pick a region.
4. Project settings → **Service accounts** → **Generate new private key**. This downloads a JSON file — its contents become the `FIREBASE_SERVICE_ACCOUNT` env var below. Keep it secret; never commit it, and never put it in your local `.env.local`.
5. Project settings → **General** → under "Your apps", add a **Web app** and copy its config values (`apiKey`, `authDomain`, `projectId`, `appId`) — these are safe to expose to the browser and become the `REACT_APP_FIREBASE_*` env vars below.
6. Deploy `firestore.rules` and `firestore.indexes.json` from the repo root: `npx firebase deploy --only firestore:rules,firestore:indexes --project <your-project-id>`. The rules scope every document to the signed-in user's own uid as defense in depth (the server's Admin SDK access bypasses them either way); the indexes are required in production for the transaction list queries to work at all (the emulator doesn't enforce them, which is why this only bites you in production if skipped).

### Environment variables

| Name                            | Package | Description                                                                                             | Default                | Needed for local dev? |
| -------------------------------- | ------- | --------------------------------------------------------------------------------------------------------- | ----------------------- | ----------------------- |
| FIREBASE_SERVICE_ACCOUNT         | SERVER  | The full JSON contents of the service account key from Firebase setup step 4, as a single-line string    |                         | No — omit it            |
| FIREBASE_PROJECT_ID              | SERVER  | Firebase project ID; also used as the emulator project ID in local dev                                   | demo-accountant         | No — defaults fine      |
| REACT_APP_API_URL                | UI      | Url for the running instance of the server package                                                       | http://localhost:3001  | Yes                      |
| REACT_APP_FIREBASE_API_KEY       | UI      | Web app config value from Firebase setup step 5                                                          |                         | Yes (any placeholder)   |
| REACT_APP_FIREBASE_APP_ID        | UI      | Web app config value from Firebase setup step 5                                                          |                         | Yes (any placeholder)   |
| REACT_APP_FIREBASE_AUTH_DOMAIN   | UI      | Web app config value from Firebase setup step 5                                                          |                         | Yes (any placeholder)   |
| REACT_APP_FIREBASE_PROJECT_ID    | UI      | Web app config value from Firebase setup step 5                                                          |                         | Yes (must match FIREBASE_PROJECT_ID) |
| REACT_APP_USE_FIREBASE_EMULATOR  | UI      | Connects the client to the local Auth emulator instead of real Firebase                                   | (unset)                 | Yes — set to `true`     |

## Testing

```bash
yarn test              # fast unit tests, no external dependencies
yarn test:integration  # server tests that exercise a real Firestore/Auth emulator
```

`test:integration` wraps the server's tests in `firebase emulators:exec`, which starts the emulators, runs the tests, then tears them down — you don't need `yarn dev:emulators` running separately for this one. These specifically cover behavior that's only real when checked against actual Firestore (Firestore-specific query constraints, `undefined`-field handling), not something a hand-rolled mock would meaningfully verify. They live in `*.integration.test.ts` files next to the service they test, and are excluded from the plain `yarn test` run. Both run in CI on every PR (`.github/workflows/ci.yml`).

Note: the Firestore emulator is more lenient than production about a couple of query-shape constraints (notably: production requires a range-filtered query's first `orderBy` to be on that same field). The integration tests can't catch a regression there — see the comment in `transaction.integration.test.ts`.

## Contributing

### Commits

This repository enforces [Conventional Commits](https://www.conventionalcommits.org/).

Commits should be in the format of `type: what you did` for example:

- `feat: added unicorn animation`
- `docs: updated readme with commit example`.

Here is a decent rundown of possible types: [conventional-commit-types
](https://github.com/commitizen/conventional-commit-types/blob/c3a9be4c73e47f2e8197de775f41d981701407fb/index.json)

## Deployment

### Netlify

If deploying to netlify, a netlify.toml file has been included to handle the build and deployment process. Connect your repository to Netlify for automated deployment. Add the environmental variables listed above to your Netlify site (Site configuration → Environment variables) — paste `FIREBASE_SERVICE_ACCOUNT`'s JSON in as-is, Netlify handles multi-line values fine.

## Todo

- [ ] App freaks out with 404 if you duplicate tab in browser requiring a manual refresh of the page
- [ ] Fix import paths
- [ ] Snackbar provider
- [ ] Add ability to toggle enabled/disabled on transactions
- [ ] Auto refresh if api version is out of date
- [ ] Auto generate hooks package from api endpoints for ui to use to replace the local hooks folder and http service classes using the openapi spec via swagger https://docs.nestjs.com/openapi/introduction and convert openapi spec to react query sdk using Orval https://orval.dev/guides/react-query
- [ ] Registration form with ENV to toggle access for apps that don't need registration or temporary registration shutdown
- [ ] Automate sending users to the login route if there is an error during token refresh
- [ ] Add api unit tests
- [ ] Add ui storybook tests
