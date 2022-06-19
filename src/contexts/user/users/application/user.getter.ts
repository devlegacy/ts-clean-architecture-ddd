import { User } from '@/contexts/user/users/domain/user'
import { UserRepository } from '@/contexts/user/users/domain/user.repository'

export class UserGetterUseCase {
  private readonly _userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this._userRepository = userRepository
  }

  async run(): Promise<User[]> {
    const users: User[] = await this._userRepository.getAll()
    return users
  }
}
