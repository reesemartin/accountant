# Accountant

Accounting assistant tool. Optimized for free hosting on [Netlify](https://www.netlify.com/) and database on [PlanetScale](https://www.planetscale.com/).

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

| Name              | Package | Description                                        | Default               |
| ----------------- | ------- | -------------------------------------------------- | --------------------- |
| DATABASE_PASSWORD | SERVER  | Password for the database                          |                       |
| DATABASE_URL      | SERVER  | Hostname of the database                           |                       |
| DATABASE_USERNAME | SERVER  | Username for the database                          |                       |
| LOG_QUERIES       | SERVER  | Log all queries to the console                     | false                 |
| REACT_APP_API_URL | UI      | Url for the running instance of the server package | http://localhost:3001 |

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
