import { FastifyInstance, FastifySchema, HTTPMethods } from 'fastify'
import { opendirSync } from 'fs'
import { ValidationError } from 'joi'
import { join, resolve } from 'path'
import { cwd } from 'process'
import { container, injectable, Lifecycle } from 'tsyringe'

import { RequestMappingMetadata, RequestMethod } from './common'
import { METHOD_METADATA, PATH_METADATA, SCHEMA_METADATA } from './common/constants'

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

/**
 * TODO: Should be a singleton because has a child container creation
 * @param fastify
 * @param config
 */
export const bootstrap = async (fastify: FastifyInstance, config: { controller: string }) => {
  // const controllerContainer = container.createChildContainer()

  const controllers = await entityLoader(config.controller)
  for (const controller of controllers) {
    const { name } = controller
    if (!container.isRegistered(name)) {
      injectable()(controller)

      container.register(name, { useClass: controller }, { lifecycle: Lifecycle.Singleton })
    }
    // This is our instantiated class
    const instance = (container.isRegistered(name) ? container.resolve(name) : new controller()) as any

    // The prefix saved to our controller
    const controllerPath: string = Reflect.getMetadata(PATH_METADATA, controller)
    // Our `routes` array containing all our routes for this controller
    // Access from Class w/o instance
    const classMethods = Reflect.ownKeys(controller.prototype)
    // Access from instance
    // console.log(Reflect.ownKeys(Object.getPrototypeOf(ctrlObj)))
    for (const classMethod of classMethods) {
      if (classMethod === 'constructor') continue

      const method = controller.prototype[classMethod]

      const routerPath: RequestMappingMetadata[typeof PATH_METADATA] = Reflect.getMetadata(PATH_METADATA, method)
      const requestMethod: Required<RequestMappingMetadata>[typeof METHOD_METADATA] =
        Reflect.getMetadata(METHOD_METADATA, method) || 0
      const schema: { schema: FastifySchema | undefined; code: number } =
        Reflect.getMetadata(SCHEMA_METADATA, method) || {}

      fastify.route({
        method: RequestMethod[requestMethod] as HTTPMethods,
        schema: schema.schema,
        attachValidation: true,
        url: fullPath(controllerPath, routerPath),
        handler: (req, res) => {
          if (req.validationError) {
            const error = req.validationError
            // Is JOI
            if (error instanceof ValidationError) {
              return res.status(schema.code || 400).send(error)
            }
            return res.status(500).send(new Error('Unhandled error'))
          }
          return instance[method.name](req, res)
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
