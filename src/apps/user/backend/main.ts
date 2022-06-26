import 'reflect-metadata'

import { fatalErrorHandler } from '@/shared/logger'

import { UserBackendApp } from './user-backend-app'

// import { MongoDB } from '@/infrastructure/driven-adapters/mongodb'

process.on('uncaughtException', fatalErrorHandler).on('unhandledRejection', fatalErrorHandler)

try {
  // const database = await MongoDB.getInstance()

  new UserBackendApp().start()
} catch (e) {
  fatalErrorHandler(e as Error)
}
