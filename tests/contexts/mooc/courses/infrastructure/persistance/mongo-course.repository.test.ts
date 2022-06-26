import '@/apps/mooc/backend/dependency-injection/index'

import { MongoClient } from 'mongodb'
import { container } from 'tsyringe'

import { CourseRepository } from '@/contexts/mooc/courses/domain/course.repository'

import { EnvironmentArranger } from '../../../../shared/infrastructure/arranger/environment-arranger'
import { MongoEnvironmentArranger } from '../../../../shared/infrastructure/mongo/mongo-environment-arranger'
import { CourseMother } from '../../domain/course.mother'

container.register<EnvironmentArranger>('EnvironmentArranger', {
  useValue: new MongoEnvironmentArranger(container.resolve<Promise<MongoClient>>('MongoClient'))
})

const repository: CourseRepository = container.resolve<CourseRepository>('CourseRepository')
const environmentArrange: Promise<EnvironmentArranger> = container.resolve('EnvironmentArranger')

beforeEach(async () => {
  await (await environmentArrange).arrange()
})

afterAll(async () => {
  await (await environmentArrange).arrange()
  await (await environmentArrange).close()
})

describe('CourseRepository', () => {
  describe('#save', () => {
    it('should have a course', async () => {
      const course = CourseMother.random()

      await repository.save(course)
    })
  })
})
