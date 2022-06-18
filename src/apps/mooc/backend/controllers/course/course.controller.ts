import HttpStatus from 'http-status'

import { CourseCreator } from '@/contexts/mooc/courses/application/course.creator'
import { Controller, Put, Schema } from '@/shared/common'

import { CourseDto } from './course.dto'
import { updateSchema } from './course.schema'

@Controller('/courses')
export class CourseController {
  constructor(private courseCreator: CourseCreator) {}

  @Schema(updateSchema, HttpStatus.UNPROCESSABLE_ENTITY)
  @Put('/:course')
  async update(req: Request<{ Body: CourseDto }>, res: Response) {
    const { id, name, duration } = req.body

    await this.courseCreator.run({
      id,
      name,
      duration
    })

    res.status(HttpStatus.CREATED)

    return {}
  }
}
