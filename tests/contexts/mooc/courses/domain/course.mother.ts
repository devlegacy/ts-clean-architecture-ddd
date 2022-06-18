import { CourseDto } from '@/apps/mooc/backend/controllers/course/course.dto'
import { Course } from '@/contexts/mooc/courses/domain/course'
import { CourseDuration } from '@/contexts/mooc/shared/domain/courses/course-duration'
import { CourseId } from '@/contexts/mooc/shared/domain/courses/course-id'
import { CourseName } from '@/contexts/mooc/shared/domain/courses/course-name'

export class CourseMother {
  static create(id: CourseId, name: CourseName, duration: CourseDuration): Course {
    return new Course({
      id,
      name,
      duration
    })
  }

  static fromRequest(request: CourseDto): Course {
    return this.create(
      new CourseId(request.id),
      new CourseName(request.name),
      new CourseDuration(request?.duration || '')
    )
  }
}
