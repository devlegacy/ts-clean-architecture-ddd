import Ajv from 'ajv'
import dotenv, { DotenvConfigOptions } from 'dotenv'
import { expand } from 'dotenv-expand'

type KeyOf<T> = keyof T extends never ? string : keyof T

export interface ConfigServiceOptions {
  schema: any
  dotenv?: DotenvConfigOptions
  expandEnv?: boolean
}

export class ConfigService<K = Record<string, unknown>> {
  #env: K

  constructor(opts: ConfigServiceOptions) {
    const config = dotenv.config(opts.dotenv)

    if (opts.expandEnv) {
      expand(config)
    }

    const ajv = new Ajv({
      allErrors: true,
      removeAdditional: true,
      useDefaults: true,
      coerceTypes: true,
      allowUnionTypes: true
      // addUsedSchema: false
    })

    const { schema } = opts
    schema.additionalProperties = false

    const data = { ...process.env }

    const validate = ajv.compile(schema)

    const valid = validate(data)
    if (!valid) {
      const error = new Error(ajv.errorsText(ajv.errors, { dataVar: 'env' }))

      // TODO: as K error - custom error
      // @ts-expect-error extended functionality
      error.errors = ajv.errors
      throw error
    }

    this.#env = {
      ...process.env,
      ...data
    } as unknown as K
  }

  get<T = any>(propertyPath: KeyOf<K>, defaultValue?: T): T | undefined {
    return this.getFromProcessEnv(propertyPath, defaultValue) as T
  }

  private getFromProcessEnv<T = any>(propertyPath: KeyOf<K>, defaultValue: any): T | undefined {
    // TODO: as K error - check why
    return ((this.#env as any)[`${String(propertyPath)}`] as T | undefined) || defaultValue
  }

  get env(): K {
    return this.#env
  }
}
