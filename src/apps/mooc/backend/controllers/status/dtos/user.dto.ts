import Joi from 'joi'
import { JoiSchema, JoiSchemaOptions } from 'joi-class-decorators'

@JoiSchemaOptions({
  allowUnknown: false
})
export class UserDto {
  @JoiSchema(Joi.string().required())
  name!: string

  @JoiSchema(Joi.number().required())
  age!: number
}
