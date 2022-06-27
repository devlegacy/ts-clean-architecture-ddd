import { CourseName } from '@/contexts/mooc/shared/domain/courses/course-name'

import { WordMother } from '../../../shared/domain/word.mother'

export class CourseNameMother {
  static create(value: string): CourseName {
    return new CourseName(value)
  }

  static random(): CourseName {
    return this.create(
      WordMother.random({
        minLength: 1,
        maxLength: 10
      })
    )
  }

  static invalidName(): string {
    return 'a'.repeat(40)
  }
}
