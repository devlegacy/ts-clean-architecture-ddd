import { UserAlreadyExistsException } from '@/contexts/user/shared/domain/users/user-already-exists.exception'
import { User } from '@/contexts/user/users/domain/user'
import { UserRepository } from '@/contexts/user/users/domain/user.repository'
import { ExistUserByUserName } from '@/contexts/user/users/services/exist-user-by-user-name.service'

import { UserBadEntityException } from '../../shared/domain/users/user-bad-entity.exception'

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
