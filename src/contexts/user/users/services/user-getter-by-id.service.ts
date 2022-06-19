import { UserNotFoundException } from '@/contexts/user/shared/domain/users/user-not-found.exception'

import { User } from '../domain/user'
import { UserRepository } from '../domain/user.repository'

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
