import { UserNotFoundException } from '../../shared'
import { User, UserRepository } from '../domain'

export class UserGetterById {
  constructor(private readonly userRepository: UserRepository) {}

  async run(id: string): Promise<User> {
    const user = await this.userRepository.getById(id)

    if (user === null) throw new UserNotFoundException()

    return user
  }
}
