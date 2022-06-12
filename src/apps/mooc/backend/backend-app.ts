import { exit } from 'process'

import { MongoDB } from '@/infrastructure/driven-adapters/mongodb'

import { Server } from './server'

export class MoocBackendApp {
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
    await this.server?.stop()
    exit(0)
  }
}
