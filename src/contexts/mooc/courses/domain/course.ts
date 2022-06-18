import { CourseDuration } from '../../shared/domain/courses/course-duration'
import { CourseId } from '../../shared/domain/courses/course-id'
import { CourseName } from '../../shared/domain/courses/course-name'

export class Course {
  readonly id!: CourseId
  readonly name!: CourseName
  readonly duration?: CourseDuration

  // constructor({ id, name, duration }: { id: string; name: string; duration: string }) {
  constructor(dto: { id: CourseId; name: CourseName; duration?: CourseDuration }) {
    // this.id = id
    // this.name = name
    // this.duration = duration
    Object.assign(this, dto)
  }

  toPrimitives() {
    return {
      id: this.id.value,
      name: this.name.value,
      duration: this.duration?.value
    }
  }
}
