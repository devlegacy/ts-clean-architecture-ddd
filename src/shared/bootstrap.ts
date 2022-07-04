import { FastifyInstance, FastifySchema, HTTPMethods } from 'fastify'
import { opendirSync } from 'fs'
import HttpStatus from 'http-status'
import { ValidationError } from 'joi'
import { join, resolve } from 'path'
import { cwd } from 'process'
import { container, injectable, Lifecycle } from 'tsyringe'

import { getMethodGroup, getSchema, RequestMappingMetadata, RequestMethod, RouteParamtypes } from './common'
import {
  HTTP_CODE_METADATA,
  METHOD_METADATA,
  PATH_METADATA,
  ROUTE_ARGS_METADATA,
  SCHEMA_METADATA
} from './common/constants'

type Constructable<T> = { new (): T } | { new (...args: any): T }

async function* readModulesRecursively(
  path: string,
  filter: RegExp
): AsyncIterable<Record<string, Constructable<unknown>>> {
  const dir = opendirSync(path)

  try {
    while (true) {
      const dirent = await dir.read()
      if (dirent === null) return

      const fullFilePath = join(path, dirent.name)

      if (dirent.isDirectory()) {
        yield* readModulesRecursively(fullFilePath, filter)
      } else if (filter.test(dirent.name)) {
        yield import(fullFilePath.toString()).then((m) => {
          return m
        })
      }
    }
  } finally {
    await dir.close()
  }
}

const isInvalidEntity = (entity: Constructable<unknown>) =>
  !entity?.name || !(typeof entity === 'function' && !!entity.prototype && entity.prototype.constructor === entity)

const entityLoader = async (path = `../../../../../../`) => {
  const controllers: Array<Constructable<unknown>> = []
  path = resolve(cwd(), path)

  for await (const entityLoaded of readModulesRecursively(path, /\.(controller|entity)\.(ts|js)$/)) {
    const keys = Object.keys(entityLoaded)
    for (const key of keys) {
      const entity = entityLoaded[key]
      if (isInvalidEntity(entity)) continue

      controllers.push(entity)
    }
  }

  return controllers
}

const getInstance = (config: { controller: string }, controller: Constructable<unknown>) => {
  const { name } = controller
  if (!container.isRegistered(name)) {
    injectable()(controller)

    container.register(name, { useClass: controller }, { lifecycle: Lifecycle.Singleton })
  }
  // This is our instantiated class
  const instance = (container.isRegistered(name) ? container.resolve(name) : new controller()) as any

  return instance
}

const getParams = (params: Record<string, unknown>, req: any, res: any): any[] => {
  const routeParams: any[] = []
  const keyParams = params ? Object.keys(params) : []
  for (const key of keyParams) {
    const [_paramtype, _index] = key.split(':')
    const paramtype = parseInt(_paramtype, 10)
    const index = parseInt(_index, 10)
    if (paramtype === RouteParamtypes.REQUEST) {
      routeParams[index] = req
    } else if (paramtype === RouteParamtypes.RESPONSE) {
      routeParams[index] = res
    } else if (paramtype === RouteParamtypes.QUERY) {
      routeParams[index] = req.query
    } else if (paramtype === RouteParamtypes.PARAM) {
      routeParams[index] = req.params
    } else if (paramtype === RouteParamtypes.BODY) {
      routeParams[index] = req.body
    } else if (paramtype === RouteParamtypes.HEADERS) {
      routeParams[index] = req.headers
    }
  }

  return routeParams
}

const setSchemaComplement = (params: Record<string, any>, schema: any, method: any): any => {
  const keyParams = Object.keys(params)
  for (const key of keyParams) {
    const [_paramtype] = key.split(':')
    const paramtype = parseInt(_paramtype, 10)

    if (paramtype === RouteParamtypes.QUERY) {
      schema.schema.querystring = params[key].pipes.at(0)
    } else if (paramtype === RouteParamtypes.PARAM) {
      schema.schema.params = params[key].pipes.at(0)
    } else if (paramtype === RouteParamtypes.BODY) {
      schema.schema.body = params[key].pipes.at(0)
    } else if (paramtype === RouteParamtypes.HEADERS) {
      schema.schema.headers = params[key].pipes.at(0)
    }
  }

  schema.schema = getSchema(schema.schema, getMethodGroup(method))

  return schema
}

/**
 * TODO: Should be a singleton because has a child container creation
 * @param fastify
 * @param config
 */

// eslint-disable-next-line max-lines-per-function
export const bootstrap = async (fastify: FastifyInstance, config: { controller: string }) => {
  // const controllerContainer = container.createChildContainer()

  const controllers = await entityLoader(config.controller)
  for (const controller of controllers) {
    const instance = getInstance(config, controller)

    // The prefix saved to our controller
    const controllerPath: string = Reflect.getMetadata(PATH_METADATA, instance.constructor) // | controller
    // Our `routes` array containing all our routes for this controller
    // Access from Class w/o instance
    const classMethods = Reflect.ownKeys(instance.__proto__) // | controller.prototye
    // Access from instance
    // console.log(Reflect.ownKeys(Object.getPrototypeOf(ctrlObj)))
    for (const classMethod of classMethods) {
      if (classMethod === 'constructor') continue // I don't remember purpose

      const method = instance[classMethod]

      const routePath: RequestMappingMetadata[typeof PATH_METADATA] = Reflect.getMetadata(PATH_METADATA, method)
      const requestMethod: Required<RequestMappingMetadata>[typeof METHOD_METADATA] =
        Reflect.getMetadata(METHOD_METADATA, method) || 0
      const schema: { schema: FastifySchema; code: number } = Reflect.getMetadata(SCHEMA_METADATA, method) || {
        schema: {},
        code: 400
      }
      const statusCode: number =
        Reflect.getMetadata(HTTP_CODE_METADATA, method) ||
        (requestMethod === RequestMethod.POST ? HttpStatus.CREATED : HttpStatus.OK)

      const params: Record<string, any> = Reflect.getMetadata(ROUTE_ARGS_METADATA, instance.constructor, classMethod)
      if (params) {
        setSchemaComplement(params, schema, requestMethod)
      }
      fastify.route({
        method: RequestMethod[requestMethod] as HTTPMethods,
        schema: !Object.keys(schema.schema) ? undefined : schema.schema,
        attachValidation: true,
        url: fullPath(controllerPath, routePath),
        handler: (req, res) => {
          res.code(statusCode)
          if (req.validationError) {
            const error = req.validationError
            // Is JOI
            if (error instanceof ValidationError) {
              return res.status(schema.code).send(error)
            }
            return res.status(500).send(new Error('Unhandled error'))
          }
          const routeParams = getParams(params, req, res)
          // Reflect.getMetadata('__routeArguments__',instance.constructor,'params')
          // const currentMethodFn = instance[method.name]
          // method() // por alguna razón pierde el bind
          // instance[classMethod]() - Revisar que conserve el valor de this
          return instance[classMethod].apply(instance, [...routeParams])
        }
      })
    }
  }
}

const fullPath = (controllerPath: string, routePath: RequestMappingMetadata['path']) => {
  controllerPath = controllerPath.startsWith('/') ? controllerPath : `/${controllerPath}`
  if (typeof routePath === 'string') {
    routePath = routePath.startsWith('/') ? routePath : `/${routePath}`
  } else {
    throw new Error('[Router/Controller loader]: undefined error')
  }

  return `${controllerPath}${routePath}`.replace(/\/+/g, '/')
}

// Notes: 💡 register as alterative to entityLoader
