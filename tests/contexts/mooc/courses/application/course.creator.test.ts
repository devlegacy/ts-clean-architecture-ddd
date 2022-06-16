import 'reflect-metadata'

import { CourseCreator } from '@/contexts/mooc/courses/application/course.creator'
import { Course } from '@/contexts/mooc/courses/domain/course'

import { CourseRepositoryMock } from '../__mocks__/course.repository.mock'

let repository: CourseRepositoryMock
let creator: CourseCreator

beforeEach(() => {
  repository = new CourseRepositoryMock()
  creator = new CourseCreator(repository)
})

describe('CourseCreator', () => {
  it('should create a valid course', async () => {
    const id = 'id'
    const name = 'name'
    const duration = '5 hours'
    const expectedCourse = new Course({
      id,
      name,
      duration
    })

    await creator.run({
      id,
      name,
      duration
    })

    repository.assertSaveHaveBeenCalledWith(expectedCourse)
  })
})
