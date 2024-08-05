# Accountant

Accounting assistant tool monorepo. Optimized for free hosting on [Netlify](https://www.netlify.com/) and database on [PlanetScale](https://www.planetscale.com/).

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

### Environment variables

Create a `.env.local` file in the root of the project. Replace `local` with the environment you intend to run `local` or `production`. Add the following variables as needed:

| Name               | Package | Description                                                       | Default               |
| ------------------ | ------- | ----------------------------------------------------------------- | --------------------- |
| DATABASE_URL       | SERVER  | Url containing the user, host, port, and password of the database |                       |
| JWT_SECRET         | SERVER  | Secret used to sign JWT tokens                                    |                       |
| LOG_QUERIES        | SERVER  | Log all queries to the console                                    | false                 |
| REACT_APP_API_URL  | UI      | Url for the running instance of the server package                | http://localhost:3001 |
| REFRESH_JWT_SECRET | SERVER  | Secret used to sign refresh JWT tokens                            |                       |

## Running the app

```bash
yarn prisma:gen
```

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

If deploying to netlify, a netlify.toml file has been included to handle the build and deployment process. Connect your repository to Netlify for automated deployment. The only thing you need to do is add the environmental variables listed above to your netlify site.

## Todo

- [ ] Add Refresh Token Automatic Reuse Detection https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/
- [ ] Switch token storage to memory instead of local storage with cookie fallback https://thenewstack.io/best-practices-for-storing-access-tokens-in-the-browser/
- [ ] App freaks out with 404 if you duplicate tab in browser requiring a manual refresh of the page
- [ ] Fix import paths
- [ ] Snackbar provider
- [ ] Add ability to toggle enabled/disabled on transactions
- [ ] Auto refresh if api version is out of date
- [ ] Auto generate hooks package from api endpoints for ui to use to replace the local hooks folder and http service classes
- [ ] Registration form with ENV to toggle access for apps that don't need registration or temporary registration shutdown
- [ ] Automate sending users to the login route if there is an error during token refresh
- [ ] Add tests
