import HttpStatus from 'http-status'

import { Body, Controller, Get, Headers, HttpCode, Param, Post, Query, Req, Res } from '@/shared/common'
import { PipeTransform } from '@/shared/common/interfaces'

import { IndexHeadersDto } from './dtos/index-headers.dto'
import { IndexQueryDto } from './dtos/index-query.dto'
import { UserDto } from './dtos/user.dto'

@Controller('/status')
export class StatusController {
  @HttpCode(HttpStatus.OK)
  @Get('/')
  index() {
    return {}
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/params/:any/:any/:other')
  params(
    @Req() req: HttpRequest,
    @Res() res: HttpResponse,
    @Query(IndexQueryDto as unknown as PipeTransform) query: IndexQueryDto,
    @Param() params: Record<string, unknown>,
    @Body(UserDto as unknown as PipeTransform) body: UserDto,
    @Headers(IndexHeadersDto as unknown as PipeTransform) headers: IndexHeadersDto
  ) {
    console.log(this)
    const hostname = req.hostname ?? 'no hostname'

    res.status(HttpStatus.OK)

    console.log(headers['x-dd-account'])

    return {
      hostname,
      query,
      params,
      body,
      headers
    }
  }
}
