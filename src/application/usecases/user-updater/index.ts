import { User, UserUpdateDto } from '@/domain/entities/user'
import { UserRepository } from '@/domain/repositories/user.repository'
import { UserGetterById } from '@/domain/services/user-getter-by-id.service'

export class UserUpdaterUseCase {
  private readonly _userRepository: UserRepository
  private readonly _userGetterById: UserGetterById

  constructor(userRepository: UserRepository) {
    this._userRepository = userRepository
    this._userGetterById = new UserGetterById(userRepository)
  }

  async run(data: UserUpdateDto): Promise<User> {
    const user = await this._userGetterById.run(data.id)
    const dataToUpdate: User = {
      age: data.age ?? user.age,
      name: data.name ?? user.name,
      id: data.id,
      username: data.username ?? user.username
    }

    await this._userRepository.update(dataToUpdate)
    return user
  }
}
