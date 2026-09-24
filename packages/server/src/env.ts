import { resolve } from 'path'
import { load } from 'ts-dotenv'

const NODE_ENV = process.env.NODE_ENV || 'local'

const envFile = load(
  {
    // Not needed when FIRESTORE_EMULATOR_HOST is set (local dev against the Firebase emulators).
    FIREBASE_PROJECT_ID: { optional: true, type: String },
    FIREBASE_SERVICE_ACCOUNT: { optional: true, type: String },
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
