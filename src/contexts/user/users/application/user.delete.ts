import { User, UserRepository } from '../domain'
import { UserGetterById } from '../services'

export class UserDeleteUseCase {
  private readonly userGetterById: UserGetterById

  constructor(private readonly userRepository: UserRepository) {
    this.userGetterById = new UserGetterById(userRepository)
  }

  async run(userId: string): Promise<User> {
    const userToDelete = await this.userGetterById.run(userId)
    await this.userRepository.delete(userToDelete)

    return userToDelete
  }
}
