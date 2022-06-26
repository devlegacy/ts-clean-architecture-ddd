import 'reflect-metadata'

import { fatalErrorHandler } from '@/shared/logger'

import { MoocBackendApp } from './mooc-backend-app'

process.on('uncaughtException', fatalErrorHandler).on('unhandledRejection', fatalErrorHandler)

try {
  new MoocBackendApp().start()
} catch (e) {
  fatalErrorHandler(e as Error)
}
