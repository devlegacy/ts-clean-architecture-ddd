import 'reflect-metadata'

import { CourseCreator } from '@/contexts/mooc/courses/application/course.creator'
import { Course } from '@/contexts/mooc/courses/domain/course'
import { CourseRepository } from '@/contexts/mooc/courses/domain/course.repository'

describe('CourseCreator', () => {
  it('should create a valid course', async () => {
    const repository: CourseRepository = {
      save: jest.fn()
    }

    const creator = new CourseCreator(repository)
    const id = 'id'
    const name = 'name'
    const duration = '5 hours'
    const expectedCourse = new Course(id, name, duration)

    await creator.run(id, name, duration)

    expect(repository.save).toHaveBeenCalledWith(expectedCourse)
  })
})
