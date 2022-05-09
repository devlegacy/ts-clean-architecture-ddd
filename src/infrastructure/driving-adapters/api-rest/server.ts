import Fastify, { FastifyInstance } from 'fastify'

import { UserController } from './controller/user.controller'

export class Server {
  private readonly _port: number
  private readonly _app: FastifyInstance

  constructor(port = 8080) {
    this._port = port
    this._app = Fastify({
      logger: {
        prettyPrint: {
          translateTime: 'HH:MM:ss Z'
          // ignore: 'pid,hostname',
        }
      }
      // bodyLimit: 0,
    })
  }

  async listen() {
    try {
      this._app.register(UserController)

      const server = await this._app.listen(this._port)
      this._app.log.info('Server running 🚀', server)
      this._app.log.info('    Press CTRL-C to stop 🛑')

      this._app.ready(() => {
        console.log(this._app.printRoutes())
      })
    } catch (e) {
      this._app.log.error(e)
    }
  }

  async stop() {
    try {
      this._app.server.close()
    } catch (e) {
      this._app.log.error(e)
    }
  }
}
