import Joi from 'joi'
import { JoiSchema, JoiSchemaOptions } from 'joi-class-decorators'

/**
 * Note: Validaciones a nivel de protocolo de comunicación (transporte de esta capa / Ruta - Controlador)
 * No validaciones de dominio
 *
 * Se asume solapamiento
 * Se "duplica" responsabilidad
 *
 * Restricciones de integridad de dominio vs Validaciones capa de transporte/peticiones/protocolo de comunicación
 */

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
