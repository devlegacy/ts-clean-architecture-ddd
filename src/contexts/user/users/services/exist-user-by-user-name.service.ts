import { UserRepository } from '@/contexts/user/users/domain/user.repository'

export class ExistUserByUserName {
  private readonly _userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this._userRepository = userRepository
  }

  async run(username: string): Promise<boolean> {
    const user = await this._userRepository.getByUserName(username)

    if (user !== null) return true

    return false
  }
}
