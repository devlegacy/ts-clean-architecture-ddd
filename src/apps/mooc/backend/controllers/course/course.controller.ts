import HttpStatus from 'http-status'

import { CourseCreator } from '@/contexts/mooc/courses/application/course.creator'
import { Controller, HttpCode, Put, Schema } from '@/shared/common'

import { updateSchema } from './course.schema'
import { CourseDto } from './dtos/course.dto'

@Controller('/courses')
export class CourseController {
  constructor(private courseCreator: CourseCreator) {}

  @HttpCode(HttpStatus.CREATED)
  @Schema(updateSchema, HttpStatus.UNPROCESSABLE_ENTITY)
  @Put('/:course')
  async update(req: HttpRequest<{ Body: CourseDto }>) {
    const { id, name, duration } = req.body

    await this.courseCreator.run({
      id,
      name,
      duration
    })

    return {}
  }
}
