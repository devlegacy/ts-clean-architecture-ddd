import { MongoDB } from '@/contexts/shared/infrastructure/persistance/mongo/mongodb'

import { Server } from './server'

export class BackendApp {
  server?: Server

  get httpServer() {
    return this.server?.getHttpServer()
  }

  async start() {
    const port = +(process.env.APP_PORT || 8080)
    this.server = new Server(port)
    await MongoDB.getInstance()
    return await this.server.listen()
  }

  async stop() {
    return await this.server?.stop()
  }
}
