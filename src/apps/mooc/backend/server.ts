import fastifyCompress from '@fastify/compress'
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'
import fastifyRateLimit from '@fastify/rate-limit'
import Fastify, { FastifyInstance } from 'fastify'
import { FastifyRouteSchemaDef, FastifyValidationResult } from 'fastify/types/schema'
import Joi, { AnySchema, ValidationError, ValidationOptions } from 'joi'
import { AddressInfo } from 'net'

import { bootstrap } from '@/shared/bootstrap'
import { logger } from '@/shared/logger'

const ajv = {
  customOptions: {
    allErrors: true,
    coerceTypes: true, // change data type of data to match type keyword
    jsonPointers: true,
    nullable: true, // support keyword "nullable" from Open API 3 specification. Refer to [ajv options](https://ajv.js.org/#options)
    removeAdditional: true, // remove additional properties
    useDefaults: true, // replace missing properties and items with the values from corresponding default keyword
    verbose: true
  },
  plugins: []
}

export class Server {
  private readonly _port: number
  private readonly _app: FastifyInstance
  // private _httpServer?: any

  constructor(port = 8080) {
    this._port = port
    this._app = Fastify({
      ajv,
      logger: logger(),
      // Read more on: https://www.fastify.io/docs/latest/Reference/HTTP2/#plain-or-insecure
      // http2: true,
      ignoreTrailingSlash: true
      // trustProxy: true
      // bodyLimit: 0,
    })

    this.loadValidationCompiler()

    this._app
      .register(fastifyHelmet)
      .register(fastifyCompress)
      .register(fastifyRateLimit)
      .register(fastifyCookie)
      .register(fastifyCors)
  }

  private loadValidationCompiler() {
    const config: ValidationOptions = {
      cache: true,
      abortEarly: false,
      debug: true,
      nonEnumerables: true,
      stripUnknown: true
    }

    // TODO: As Fastify JOI validation Compiler
    this._app.setValidatorCompiler((schemaDefinition: FastifyRouteSchemaDef<AnySchema>): FastifyValidationResult => {
      const { schema } = schemaDefinition

      return (data: any) => {
        if (Joi.isSchema(schema)) return schema.validate(data, config)

        return true
      }
    })

    // TODO: As Fastify JOI Schema Error Formatter
    // this._app.setSchemaErrorFormatter((errors) => {
    //   this._app.log.error({ err: errors }, 'Validation failed')

    //   return new Error('Error!')
    // })

    // TODO: As Fastify JOI Schema Error Handler
    this._app.setErrorHandler((error, req, res) => {
      // Is JOI
      if (error instanceof ValidationError) {
        return res.send(error)
      }
      return res.status(500).send(new Error('Unhandled error'))
    })
  }

  async listen() {
    await bootstrap(this._app, { controller: './src/apps/mooc/backend/controllers' })

    await this._app.listen({
      port: this._port,
      host: '0.0.0.0'
    })
    const address: AddressInfo = this._app.server.address() as AddressInfo

    logger().info(`🚀 Server running on: http://localhost:${address.port}`)
    logger().info('    Press CTRL-C to stop 🛑')

    // if (this._app.isDebug()) {
    logger().info(this._app.printRoutes())
    // }
  }

  getHttpServer() {
    return this._app.server
  }

  async stop() {
    try {
      this._app.server.close()
    } catch (e) {
      this._app.log.error(e)
    }
  }
}
