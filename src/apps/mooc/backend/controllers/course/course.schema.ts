import { FastifySchema } from 'fastify'

import { CourseDto } from './dtos/course.dto'

export const updateSchema: FastifySchema = {
  body: CourseDto
}
