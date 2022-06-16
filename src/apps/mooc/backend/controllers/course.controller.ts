import HttpStatus from 'http-status'

import { CourseCreator } from '@/contexts/mooc/courses/application/course.creator'
import { Controller, Put } from '@/shared/common'

import { CourseDto } from './course.schema'

@Controller('/courses')
export class CourseController {
  constructor(private courseCreator: CourseCreator) {}

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
