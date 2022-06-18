import { FastifySchema } from 'fastify'

import { CourseDto } from './course.dto'

export const updateSchema: FastifySchema = {
  body: CourseDto
}
