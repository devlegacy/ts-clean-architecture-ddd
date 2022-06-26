import { StringValueObject } from '@/contexts/shared/domain/value-object/string-value-object'

import { CourseNameLengthExceeded } from './course-name-length-exceeded.error'

const MAX_CHARACTER_LIMIT = 30

export class CourseName extends StringValueObject {
  constructor(value: string) {
    super(value)

    this.ensureLengthIsLessThanLimit(value)
  }

  private ensureLengthIsLessThanLimit(value: string) {
    if (value.length > MAX_CHARACTER_LIMIT) {
      throw new CourseNameLengthExceeded(`The course name <${value}> has more than ${MAX_CHARACTER_LIMIT} characters`)
    }
  }
}
