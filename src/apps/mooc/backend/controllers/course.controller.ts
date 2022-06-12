import { Controller, Put } from '@/shared/common'

@Controller('/course')
export class CourseController {
  @Put('/')
  index(req: Request, res: Response) {
    res.status(201)

    return {}
  }
}
