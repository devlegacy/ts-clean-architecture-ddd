import { Course } from '@/contexts/mooc/courses/domain/course'
import { FileCourseRepository } from '@/contexts/mooc/courses/infrastructure/persistance/file-course.repository'

describe('File Course Repository', () => {
  it('should save a course', async () => {
    const expectedCourse = new Course({
      id: 'id',
      name: 'name',
      duration: 'duration'
    })
    const repository = new FileCourseRepository()

    await repository.save(expectedCourse)

    const course = await repository.search('id')
    expect(course).toEqual(expectedCourse)
  })
})
