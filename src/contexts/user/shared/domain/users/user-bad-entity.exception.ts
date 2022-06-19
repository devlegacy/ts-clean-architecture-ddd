export class UserBadEntityException extends Error {
  constructor() {
    super('User with bad entity')
  }
}
