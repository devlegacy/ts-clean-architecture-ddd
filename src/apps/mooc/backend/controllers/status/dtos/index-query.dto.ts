import Joi from 'joi'
import { JoiSchema, JoiSchemaOptions } from 'joi-class-decorators'

@JoiSchemaOptions({
  allowUnknown: false
})
export class IndexQueryDto {
  @JoiSchema(Joi.number().required())
  page!: number

  @JoiSchema(Joi.number().required())
  limit!: number
}
