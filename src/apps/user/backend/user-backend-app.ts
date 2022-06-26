// import './dependency-injection'

import { MongoDB } from '@/contexts/shared/infrastructure/persistance/mongo/mongodb'

import { Server } from './server'

export class UserBackendApp {
  server?: Server

  get httpServer() {
    return this.server?.getHttpServer()
  }

  async start() {
    const APP_PORT = 8081
    this.server = new Server(APP_PORT)
    await MongoDB.getInstance()
    return await this.server.listen()
  }

  stop() {
    this.server?.stop()
  }
}
