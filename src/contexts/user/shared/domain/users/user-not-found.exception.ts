import HttpStatus from 'http-status'

import { HttpError } from '@/contexts/shared/infrastructure/http/http-error'

export class UserNotFoundException extends Error implements HttpError {
  code = HttpStatus.NOT_FOUND
  constructor() {
    super('User not found')
  }
}
