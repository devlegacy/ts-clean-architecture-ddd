import { User } from '@/domain/entities/user'
import { UserAlreadyExistsException } from '@/domain/exceptions/user-already-exists.exception'
import { UserBadEntityException } from '@/domain/exceptions/user-bad-entity.exception'
import { UserRepository } from '@/domain/repositories/user.repository'
import { ExistUserByUserName } from '@/domain/services/exist-user-by-user-name.service'

export class UserCreatorUseCase {
  private readonly _userRepository: UserRepository
  private readonly _existUserByUserName: ExistUserByUserName

  constructor(userRepository: UserRepository) {
    this._userRepository = userRepository
    this._existUserByUserName = new ExistUserByUserName(userRepository)
  }

  async run(body: User): Promise<User> {
    if (!body.username?.length) throw new UserBadEntityException()

    const existUser: boolean = await this._existUserByUserName.run(body.username)

    if (existUser) throw new UserAlreadyExistsException()

    const userCreated: User = await this._userRepository.save(body)

    return userCreated
  }
}
