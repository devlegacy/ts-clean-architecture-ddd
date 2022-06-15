/**
 * Note: Always import of domain never *Infrastructure*
 * Todas las capas de nuestra arquitectura más externas solo deberían depender de las capas más internas (infraestructura -> application -> domain)
 * Esta premisa debe garantizar que si cambiamos algo de infraestructura (no hay que modificar) no se afecta el comportamiento del dominio
 */

import { inject, injectable } from 'tsyringe'

import { Course } from '../domain/course'
import { CourseRepository } from '../domain/course.repository'

@injectable()
export class CourseCreator {
  constructor(@inject('CourseRepository') private repository: CourseRepository) {}

  async run(id: string, name: string, duration: string) {
    const course = new Course(id, name, duration)

    return this.repository.save(course)
  }
}
