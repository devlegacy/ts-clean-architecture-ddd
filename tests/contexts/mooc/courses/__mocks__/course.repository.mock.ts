import { Course } from '@/contexts/mooc/courses/domain/course'
import { CourseRepository } from '@/contexts/mooc/courses/domain/course.repository'

export class CourseRepositoryMock implements CourseRepository {
  saveMock: jest.Mock
  constructor() {
    this.saveMock = jest.fn()
  }

  async save(course: Course): Promise<void> {
    this.saveMock(course)
  }

  assertSaveHaveBeenCalledWith(expected: Course): void {
    expect(this.saveMock).toHaveBeenCalledWith(expected)
  }
}
