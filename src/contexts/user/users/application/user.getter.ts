import { User, UserRepository } from '../domain'

export class UserGetterUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async run(): Promise<User[]> {
    const users: User[] = await this.userRepository.getAll()
    return users
  }
}
