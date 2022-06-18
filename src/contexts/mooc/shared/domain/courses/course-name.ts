import { StringValueObject } from '@/contexts/shared/domain/value-object/string-value-object'

import { CourseNameLengthExceeded } from './course-name-length-exceeded.error'

export class CourseName extends StringValueObject {
  constructor(value: string) {
    super(value)

    this.ensureLengthIsLessThan30Characters(value)
  }

  private ensureLengthIsLessThan30Characters(value: string) {
    if (value.length > 30) {
      throw new CourseNameLengthExceeded(`The course name <${value}> has more than 30 characters`)
    }
  }
}
