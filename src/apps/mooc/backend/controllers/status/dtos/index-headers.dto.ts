import { JoiSchema, JoiSchemaOptions } from 'joi-class-decorators'

import Joi from '@/shared/joi'

@JoiSchemaOptions({
  allowUnknown: false
})
export class IndexHeadersDto {
  @JoiSchema(Joi.string().trim().objectId().required())
  'x-dd-user'!: string

  @JoiSchema(Joi.string().trim().objectId().required())
  'x-dd-account'!: string
}
