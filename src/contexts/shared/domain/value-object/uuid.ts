import validate from 'uuid-validate'

import { InvalidArgumentError } from './invalid-argument.error'

export class Uuid {
  readonly value: string

  constructor(value: string) {
    this.ensureIsValidUuid(value)

    this.value = value
  }

  private ensureIsValidUuid(id: string) {
    if (!validate(id)) {
      throw new InvalidArgumentError(`<${this.constructor.name}> does not allow the value <${id}>`)
    }
  }

  toString() {
    return this.value
  }
}
