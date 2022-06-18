import { CourseName } from '@/contexts/mooc/shared/domain/courses/course-name'

import { WordMother } from '../../../shared/domain/word.mother'

export class CourseNameMother {
  static create(value: string): CourseName {
    return new CourseName(value)
  }

  static random(): CourseName {
    // Note: 15, debido a que faker retorna undefined con valores > 20
    return this.create(WordMother.random({ maxLength: 15 }))
  }

  static invalidName(): string {
    return 'a'.repeat(40)
  }
}
