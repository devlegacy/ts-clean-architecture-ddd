import { User } from '../entities/user'
import { UserNotFoundException } from '../exceptions/user-not-found.exception'
import { UserRepository } from '../repositories/user.repository'

export class UserGetterById {
  private readonly _userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this._userRepository = userRepository
  }

  async run(id: string): Promise<User> {
    const user = await this._userRepository.getById(id)

    if (user === null) throw new UserNotFoundException()

    return user
  }
}
