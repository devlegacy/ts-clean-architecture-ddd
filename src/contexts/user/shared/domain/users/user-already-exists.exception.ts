import HttpStatus from 'http-status'

import { HttpError } from '@/contexts/shared/infrastructure/http/http-error'

export class UserAlreadyExistsException extends Error implements HttpError {
  code = HttpStatus.UNPROCESSABLE_ENTITY

  constructor() {
    super('User already exists')
  }
}
