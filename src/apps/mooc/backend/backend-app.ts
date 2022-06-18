import { MongoClient } from 'mongodb'
import { container } from 'tsyringe'

import { CourseRepository } from '@/contexts/mooc/courses/domain/course.repository'
import { MongoCourseRepository } from '@/contexts/mooc/courses/infrastructure/persistance/mongo-course.repository'
import { MongoConfigFactory } from '@/contexts/mooc/shared/infrastructure/persistence/mongo/mongo-config.factory'
import { MongoClientFactory } from '@/contexts/shared/infrastructure/persistance/mongo/mongo-client.factory'
import MongoConfig from '@/contexts/shared/infrastructure/persistance/mongo/mongo-config'

import { Server } from './server'

export class MoocBackendApp {
  server?: Server

  get httpServer() {
    return this.server?.getHttpServer()
  }

  async start() {
    // TODO: Inject dependencies or create dependency injector
    container.register<MongoConfig>('MongoConfig', { useValue: MongoConfigFactory.createConfig() })
    container.register<Promise<MongoClient>>('MongoClient', {
      useValue: MongoClientFactory.createClient('mooc', container.resolve<MongoConfig>('MongoConfig'))
    })
    container.register<CourseRepository>('CourseRepository', {
      useValue: new MongoCourseRepository(container.resolve<Promise<MongoClient>>('MongoClient'))
    })

    const port = +(process.env.APP_PORT || 8080)
    this.server = new Server(port)
    return await this.server.listen()
  }

  async stop() {
    await this.server?.stop()
  }
}
