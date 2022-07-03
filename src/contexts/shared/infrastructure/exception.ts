import { HttpError } from './http/http-error'

export class Exception extends Error {
  constructor(message?: string) {
    super(message)
  }
}

export class HttpException extends Error implements HttpError {
  code!: number
  constructor(message?: string) {
    super(message)
  }
}
