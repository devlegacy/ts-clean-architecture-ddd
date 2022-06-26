import { resolve } from 'path'
import { cwd } from 'process'

import { ConfigService } from './config.service'

export const config = new ConfigService({
  dotenv: {
    path: resolve(`${cwd()}`, './.env'),
    debug: true
  },
  expandEnv: true,
  schema: {
    type: 'object',
    required: ['APP_PORT', 'APP_DEBUG'],
    properties: {
      APP_PORT: {
        type: 'number',
        default: 8080
      },
      APP_DEBUG: {
        type: 'boolean',
        default: true
      },
      APP_NAME: {
        type: 'string',
        default: 'Default application name'
      }
    }
  }
})
