import { User, UserRepository, UserUpdateDto } from '../domain'
import { UserGetterById } from '../services'

export class UserUpdaterUseCase {
  private readonly _userGetterById: UserGetterById

  constructor(private readonly userRepository: UserRepository) {
    this._userGetterById = new UserGetterById(userRepository)
  }

  async run(data: UserUpdateDto): Promise<User> {
    const user = await this._userGetterById.run(data.id)
    const dataToUpdate: User = {
      ...user,
      ...data
    }

    // Alternative sample code:
    //  {
    //   age: data.age ?? user.age,
    //   name: data.name ?? user.name,
    //   id: data.id,
    //   username: data.username ?? user.username
    // }

    await this.userRepository.update(dataToUpdate)
    return user
  }
}
