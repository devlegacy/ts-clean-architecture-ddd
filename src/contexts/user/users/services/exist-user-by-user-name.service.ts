import { UserRepository } from '@/contexts/user/users/domain/user.repository'

export class ExistUserByUserName {
  constructor(private readonly userRepository: UserRepository) {}

  async run(username: string): Promise<boolean> {
    const user = await this.userRepository.getByUserName(username)

    if (!user) return false

    return true
  }
}
