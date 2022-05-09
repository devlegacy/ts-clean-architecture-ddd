import { User } from '@/domain/entities/user'
import { UserRepository } from '@/domain/repositories/user.repository'
import { UserGetterById } from '@/domain/services/user-getter-by-id.service'

export class UserDeleteUseCase {
  private readonly _userRepository: UserRepository
  private readonly _userGetterById: UserGetterById

  constructor(userRepository: UserRepository) {
    this._userRepository = userRepository
    this._userGetterById = new UserGetterById(userRepository)
  }

  async run(userId: string): Promise<User> {
    const userToDelete = await this._userGetterById.run(userId)
    await this._userRepository.delete(userToDelete)

    return userToDelete
  }
}
