import 'reflect-metadata'

import { CourseCreator } from '@/contexts/mooc/courses/application/course.creator'
import { Course } from '@/contexts/mooc/courses/domain/course'
import { Uuid } from '@/contexts/shared/domain/value-object/uuid'

import { CourseRepositoryMock } from '../__mocks__/course.repository.mock'

let repository: CourseRepositoryMock
let creator: CourseCreator

beforeEach(() => {
  repository = new CourseRepositoryMock()
  creator = new CourseCreator(repository)
})

describe('CourseCreator', () => {
  it('should create a valid course', async () => {
    const id = new Uuid('e16f5c16-55ad-480a-99f9-3222c40f2152')
    const name = 'name'
    const duration = '5 hours'
    const expectedCourse = new Course({
      id,
      name,
      duration
    })

    await creator.run({
      id: id.value,
      name,
      duration
    })

    repository.assertSaveHaveBeenCalledWith(expectedCourse)
  })
})
