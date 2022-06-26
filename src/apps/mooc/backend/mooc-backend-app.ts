import './dependency-injection'

import { config } from '@/shared/config'

import { Server } from './server'

export class MoocBackendApp {
  server?: Server

  get httpServer() {
    return this.server?.getHttpServer()
  }

  async start() {
    const APP_PORT = config.get<number>('APP_PORT', 8080)
    this.server = new Server(APP_PORT)
    return await this.server.listen()
  }

  stop() {
    this.server?.stop()
  }
}
