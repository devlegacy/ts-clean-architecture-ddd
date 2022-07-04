import { FastifySchema } from 'fastify'
import Joi from 'joi'
import { getClassSchema, JoiValidationGroup } from 'joi-class-decorators'
import { Constructor } from 'joi-class-decorators/internal/defs'

import { METHOD_METADATA, SCHEMA_METADATA } from '../../constants'
import { RequestMethod } from '../../enums'

type MethodGroup = { group: JoiValidationGroup } | undefined

export const getSchema = (schema: FastifySchema, group?: MethodGroup): FastifySchema | undefined => {
  let invalidSchemas = 0
  const keys = Object.keys(schema) as (keyof FastifySchema)[]
  if (!keys.length) return undefined

  for (const key of keys) {
    const objectSchema = schema[key] || {}
    if (Joi.isSchema(objectSchema)) continue

    if (typeof objectSchema === 'function') {
      const buildSchema = getClassSchema(objectSchema as Constructor, group)

      if (Joi.isSchema(buildSchema)) {
        schema[key] = buildSchema
        continue
      }
    }

    // Sanitize
    delete schema[key]
    invalidSchemas++
  }

  if (invalidSchemas === keys.length) return undefined

  return schema
}

export const getMethodGroup = (group: RequestMethod): MethodGroup => {
  if (group === RequestMethod.POST) {
    return { group: 'CREATE' }
  } else if ([RequestMethod.PUT, RequestMethod.PATCH].includes(group)) {
    return { group: 'UPDATE' }
  } else if (group === RequestMethod.DELETE) {
    return { group: 'DELETE' }
  }
  return undefined
}

export const Schema = (schema: FastifySchema, code = 400): MethodDecorator => {
  return (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const method = Reflect.getMetadata(METHOD_METADATA, descriptor.value)

    const schemaBuilded = getSchema(schema, getMethodGroup(method))

    if (!schemaBuilded) return descriptor

    Reflect.defineMetadata(
      SCHEMA_METADATA,
      {
        schema: schemaBuilded,
        code
      },
      descriptor.value
    )

    return descriptor
  }
}
