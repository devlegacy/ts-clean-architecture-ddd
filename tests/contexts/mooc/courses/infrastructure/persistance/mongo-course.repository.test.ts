import '@/apps/mooc/backend/dependency-injection/index'

import { EnvironmentArranger } from 'tests/contexts/shared/infrastructure/arranger/environment-arranger'
import { container } from 'tsyringe'

import { CourseRepository } from '@/contexts/mooc/courses/domain/course.repository'

import { CourseMother } from '../../domain/course.mother'

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
