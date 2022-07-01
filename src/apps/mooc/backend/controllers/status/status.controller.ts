import { Controller, Get } from '@/shared/common'

@Controller('/status')
export class StatusController {
  @Get('/')
  index(req: HttpRequest, res: HttpResponse) {
    res.status(200)

    return {}
  }
}
