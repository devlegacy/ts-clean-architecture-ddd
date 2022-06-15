import { FastifyInstance, HTTPMethods } from 'fastify'
import { opendirSync } from 'fs'
import { join, resolve } from 'path'
import { cwd } from 'process'
import { container, injectable, Lifecycle } from 'tsyringe'

import { RequestMappingMetadata, RequestMethod } from './common'

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
  // eslint-disable-next-line operator-linebreak
  !entity?.name ||
  // eslint-disable-next-line operator-linebreak
  !(typeof entity === 'function' && !!entity.prototype && entity.prototype.constructor === entity)

const entityLoader = async (path = `../../../../../../`) => {
  const controllers: Array<Constructable<unknown>> = []
  path = resolve(cwd(), path)
  // console.log(path)
  for await (const entityLoaded of readModulesRecursively(path, /\.(controller|entity)\.(ts|js)$/)) {
    const keys = Object.keys(entityLoaded)
    for (const key of keys) {
      const entity = entityLoaded[key]
      if (isInvalidEntity(entity)) continue

      // const token = entity.name
      // const modelOptions = Reflect.getMetadata(DecoratorKeys.ModelOptions, entity)

      // if (token && modelOptions && !container.isRegistered(token)) {
      //   container.register(token, {
      //     useValue: getModelForClass(entity, {})
      //   })
      // } else if (token && modelOptions && container.isRegistered(token)) {
      //   throw new Error('Model registered')
      // } else {
      controllers.push(entity)
      // }
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
    const controllerPath: string = Reflect.getMetadata('path', controller)
    // Our `routes` array containing all our routes for this controller
    // Access from Class w/o instance
    const classMethods = Reflect.ownKeys(controller.prototype)
    // Access from instance
    // console.log(Reflect.ownKeys(Object.getPrototypeOf(ctrlObj)))
    for (const classMethod of classMethods) {
      if (classMethod === 'constructor') continue

      const method = controller.prototype[classMethod]

      const routerPath: RequestMappingMetadata['path'] = Reflect.getMetadata('path', method)
      const requestMethod: Required<RequestMappingMetadata>['method'] = Reflect.getMetadata('method', method) || 0

      fastify.route({
        method: RequestMethod[requestMethod] as HTTPMethods,
        url: fullPath(controllerPath, routerPath),
        handler: (req, res) => {
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

// Notes: 💡 register
