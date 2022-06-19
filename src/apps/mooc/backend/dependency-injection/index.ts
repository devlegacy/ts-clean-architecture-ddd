import { MongoClient } from 'mongodb'
import { container } from 'tsyringe'

import { CourseRepository } from '@/contexts/mooc/courses/domain/course.repository'
import { MongoCourseRepository } from '@/contexts/mooc/courses/infrastructure/persistance/mongo-course.repository'
import { MongoConfigFactory } from '@/contexts/mooc/shared/infrastructure/persistence/mongo/mongo-config.factory'
import { MongoClientFactory } from '@/contexts/shared/infrastructure/persistance/mongo/mongo-client.factory'
import MongoConfig from '@/contexts/shared/infrastructure/persistance/mongo/mongo-config'

// TODO: Inject dependencies or create dependency injector
container.register<MongoConfig>('MongoConfig', { useValue: MongoConfigFactory.createConfig() })
container.register<Promise<MongoClient>>('MongoClient', {
  useValue: MongoClientFactory.createClient('mooc', container.resolve<MongoConfig>('MongoConfig'))
})
container.register<CourseRepository>('CourseRepository', {
  useValue: new MongoCourseRepository(container.resolve<Promise<MongoClient>>('MongoClient'))
})

export default container
