import { Controller, Get } from '@/shared/common'

@Controller('/status')
export class StatusController {
  @Get('/')
  index(req: Request, res: Response) {
    res.status(200)

    return {}
  }
}
