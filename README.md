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

### Firebase setup (one time, ~10 minutes)

The app needs a Firebase project for Google Sign-In and Firestore. This has to be done through the Firebase console (it needs your Google account), but it's a handful of clicks:

1. Go to the [Firebase console](https://console.firebase.google.com/) and create a new project (or reuse an existing Google Cloud project).
2. **Authentication** → Sign-in method → enable the **Google** provider.
3. **Firestore Database** → Create database → start in **production mode**, pick a region.
4. Project settings → **Service accounts** → **Generate new private key**. This downloads a JSON file — its contents become the `FIREBASE_SERVICE_ACCOUNT` env var below. Keep it secret; never commit it.
5. Project settings → **General** → under "Your apps", add a **Web app** and copy its config values (`apiKey`, `authDomain`, `projectId`, `appId`) — these are safe to expose to the browser and become the `REACT_APP_FIREBASE_*` env vars below.
6. Optionally deploy `firestore.rules` from the repo root (`Firestore Database` → `Rules`, or via the Firebase CLI) — it scopes every document to the signed-in user's own uid as defense in depth. The server's Admin SDK access bypasses these rules either way.

### Environment variables

Create a `.env.local` file in the root of the project. Replace `local` with the environment you intend to run `local` or `production`. Add the following variables as needed:

| Name                            | Package | Description                                                                                             | Default                |
| -------------------------------- | ------- | --------------------------------------------------------------------------------------------------------- | ----------------------- |
| FIREBASE_SERVICE_ACCOUNT         | SERVER  | The full JSON contents of the service account key from Firebase setup step 4, as a single-line string    |                         |
| REACT_APP_API_URL                | UI      | Url for the running instance of the server package                                                       | http://localhost:3001  |
| REACT_APP_FIREBASE_API_KEY       | UI      | Web app config value from Firebase setup step 5                                                          |                         |
| REACT_APP_FIREBASE_APP_ID        | UI      | Web app config value from Firebase setup step 5                                                          |                         |
| REACT_APP_FIREBASE_AUTH_DOMAIN   | UI      | Web app config value from Firebase setup step 5                                                          |                         |
| REACT_APP_FIREBASE_PROJECT_ID    | UI      | Web app config value from Firebase setup step 5                                                          |                         |

## Running the app

In separate terminals run:

```bash
yarn dev:server
```

```bash
yarn dev:ui
```

Your app is now running on [http://localhost:3000](http://localhost:3000) with server api accessible at [http://localhost:3001](http://localhost:3001).

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
