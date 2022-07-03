import { ApolloServer } from 'apollo-server-fastify'
import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify'
import { FastifyRouteSchemaDef, FastifyValidationResult } from 'fastify/types/schema'
import CreateError from 'http-errors'
import Joi, { AnySchema, ValidationError, ValidationOptions } from 'joi'
import { AddressInfo } from 'net'

import { HttpError } from '@/contexts/shared/infrastructure/http/http-error'
import { config } from '@/shared/config'
import { logger } from '@/shared/logger'

import schema from './schema'

const ajv = {
  customOptions: {
    allErrors: true,
    coerceTypes: true, // change data type of data to match type keyword
    jsonPointers: true,
    // support keyword "nullable" from Open API 3 specification.
    // Refer to [ajv options](https://ajv.js.org/#options)
    nullable: true,
    removeAdditional: true, // remove additional properties
    useDefaults: true, // replace missing properties and items with the values from corresponding default keyword
    verbose: true
  },
  plugins: []
}

export class GraphQL {
  private readonly _port: number
  private readonly _app: FastifyInstance
  private readonly _apolloServer: ApolloServer
  // private _httpServer?: any

  constructor(port = 8080) {
    this._port = port

    const options: FastifyServerOptions = {
      ajv,
      logger: logger(),
      // Read more on: https://www.fastify.io/docs/latest/Reference/HTTP2/#plain-or-insecure
      // http2: true,
      ignoreTrailingSlash: true,
      forceCloseConnections: true // On Test or development
      // trustProxy: true
      // bodyLimit: 0,
    }
    this._app = Fastify(options)

    this.loadValidationCompiler()

    this._apolloServer = new ApolloServer({
      schema
    })
  }

  private loadValidationCompiler() {
    const config: ValidationOptions = {
      cache: true,
      abortEarly: false,
      debug: true,
      nonEnumerables: true,
      stripUnknown: true
    }

    // TODO: Create as Fastify JOI validation Compiler
    this._app.setValidatorCompiler((schemaDefinition: FastifyRouteSchemaDef<AnySchema>): FastifyValidationResult => {
      const { schema } = schemaDefinition

      return (data: any) => {
        if (Joi.isSchema(schema)) return schema.validate(data, config)

        return true
      }
    })

    // TODO: Create as Fastify JOI Schema Error Formatter
    // this._app.setSchemaErrorFormatter((errors) => {
    //   this._app.log.error({ err: errors }, 'Validation failed')

    //   return new Error('Error!')
    // })

    // TODO: Create as Fastify JOI Schema Error Handler
    this._app.setErrorHandler(async (error, req, res) => {
      // Is JOI
      if (error instanceof ValidationError) {
        return res.send(error)
        // Is HTTP
      } else if ((error as unknown as HttpError)?.code) {
        return res.send(CreateError(error.code, error.message))
      }
      return res.status(500).send(new Error('Unhandled error'))
    })
  }

  async listen() {
    await this._apolloServer.start()
    this._app.register(this._apolloServer.createHandler())

    await this._app.listen({
      port: this._port,
      host: '0.0.0.0'
    })

    const address: AddressInfo = this._app.server.address() as AddressInfo

    this._app.log.info(
      `🚀 GraphQl Server running on: http://localhost:${address.port}${this._apolloServer.graphqlPath}`
    )
    this._app.log.info('    Press CTRL-C to stop 🛑')

    const APP_DEBUG = config.get<boolean>('APP_DEBUG', false)
    if (APP_DEBUG) {
      this._app.log.info(this._app.printRoutes())
    }
  }

  getHttpServer() {
    return this._app.server
  }

  stop() {
    try {
      this._app.server.close()
    } catch (e) {
      this._app.log.error(e)
    }
  }
}
