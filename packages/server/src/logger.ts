import pino from 'pino'

import { env } from './env'

export const logger = pino({
  formatters: {
    level(label) {
      return {
        level: label,
      }
    },
  },
  level: env.NODE_ENV === 'test' ? 'silent' : env.NODE_ENV === 'prod' ? 'info' : 'debug',
})
