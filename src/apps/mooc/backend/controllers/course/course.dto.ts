import Joi from 'joi'
import { JoiSchema, JoiSchemaOptions } from 'joi-class-decorators'

@JoiSchemaOptions({
  allowUnknown: false
})
export class CourseDto {
  @JoiSchema(Joi.string().required())
  id!: string

  @JoiSchema(Joi.string().required())
  name!: string

  @JoiSchema(Joi.string().optional())
  duration?: string
}
