import { CourseId } from '@/contexts/mooc/shared/domain/courses/course-id'

import { UuidMother } from '../../../shared/domain/uuid.mother'

export class CourseIdMother {
  static create(value: string): CourseId {
    return new CourseId(value)
  }

  static random(): CourseId {
    return this.create(UuidMother.random())
  }
}
