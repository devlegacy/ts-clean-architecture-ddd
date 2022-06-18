import { CourseDto } from '@/apps/mooc/backend/controllers/course/course.dto'
import { CourseDuration } from '@/contexts/mooc/shared/domain/courses/course-duration'
import { CourseId } from '@/contexts/mooc/shared/domain/courses/course-id'
import { CourseName } from '@/contexts/mooc/shared/domain/courses/course-name'

import { CourseDurationMother } from '../domain/course-duration.mother'
import { CourseIdMother } from '../domain/course-id.mother'
import { CourseNameMother } from '../domain/course-name.mother'

export class CreateCourseRequestMother {
  static create(id: CourseId, name: CourseName, duration: CourseDuration): CourseDto {
    return {
      id: id.value,
      name: name.value,
      duration: duration.value
    }
  }

  static random(): CourseDto {
    return this.create(CourseIdMother.random(), CourseNameMother.random(), CourseDurationMother.random())
  }

  static invalidRequest(): CourseDto {
    return {
      id: CourseIdMother.random().value,
      name: CourseNameMother.invalidName(),
      duration: CourseDurationMother.random().value
    }
  }
}
