/**
 * Note: Always import of domain never *Infrastructure*
 * Todas las capas de nuestra arquitectura más externas solo deberían depender de las capas más internas (infraestructura -> application -> domain)
 * Esta premisa debe garantizar que si cambiamos algo de infraestructura (no hay que modificar) no se afecta el comportamiento del dominio
 */

import { inject, injectable } from 'tsyringe'

import { CourseDto } from '@/apps/mooc/backend/controllers/course/dtos/course.dto'
import { Uuid } from '@/contexts/shared/domain/value-object/uuid'

import { CourseDuration } from '../../shared/domain/courses/course-duration'
import { CourseName } from '../../shared/domain/courses/course-name'
import { Course } from '../domain/course'
import { CourseRepository } from '../domain/course.repository'

@injectable()
export class CourseCreator {
  constructor(@inject('CourseRepository') private readonly repository: CourseRepository) {}

  async run(request: CourseDto) {
    const course = new Course({
      id: new Uuid(request.id),
      name: new CourseName(request.name),
      duration: !request.duration ? undefined : new CourseDuration(request.duration)
    })

    return this.repository.save(course)
  }
}
