import 'reflect-metadata'

import { CourseCreator } from '@/contexts/mooc/courses/application/course.creator'
import { CourseNameLengthExceeded } from '@/contexts/mooc/shared/domain/courses/course-name-length-exceeded.error'

import { CourseRepositoryMock } from '../__mocks__/course.repository.mock'
import { CourseMother } from '../domain/course.mother'
import { CreateCourseRequestMother } from './create-course-request.mother'

let repository: CourseRepositoryMock
let creator: CourseCreator

beforeEach(() => {
  repository = new CourseRepositoryMock()
  creator = new CourseCreator(repository)
})

describe('CourseCreator', () => {
  it('should create a valid course', async () => {
    const request = CreateCourseRequestMother.random()
    const course = CourseMother.fromRequest(request)

    await creator.run(request)

    repository.assertLastSavedCourseIs(course)
  })

  it('should throw error if course name length is exceeded', async () => {
    expect(async () => {
      const request = CreateCourseRequestMother.invalidRequest()
      const course = CourseMother.fromRequest(request)
      await creator.run(request)
      repository.assertSaveHaveBeenCalledWith(course)
    }).rejects.toThrow(CourseNameLengthExceeded)
  })
})
