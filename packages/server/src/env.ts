import { resolve } from 'path'
import { load } from 'ts-dotenv'

const NODE_ENV = process.env.NODE_ENV || 'local'

const envFile = load(
  {
    DATABASE_PASSWORD: String,
    DATABASE_URL: String,
    DATABASE_USERNAME: String,
    LOG_QUERIES: Boolean,
  },
  {
    overrideProcessEnv: false,
    path: resolve(__dirname, `./.env.${NODE_ENV}`),
  },
)

export type EnvVars = {
  NODE_ENV: string
} & typeof envFile

export const env: EnvVars = {
  ...envFile,
  NODE_ENV,
}