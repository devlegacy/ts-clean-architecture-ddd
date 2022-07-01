import dotenv from 'dotenv'
import { expand } from 'dotenv-expand'

import { MongoDB } from '@/contexts/shared/infrastructure/persistance/mongo/mongodb'
import { UserAlreadyExistsException } from '@/contexts/user'
import {
  MongoDBUserRepository,
  // InMemoryUserRepository,
  User,
  UserCreatorUseCase,
  UserDeleteUseCase,
  UserGetterUseCase,
  UserUpdaterUseCase
} from '@/contexts/user/users'
import { error, info } from '@/shared/logger'

const bootstrap = async () => {
  const config = dotenv.config()
  expand(config)

  // const userRepository = new InMemoryUserRepository()

  const database = await MongoDB.getInstance()
  const userRepository = new MongoDBUserRepository(database)

  const userCreatorUseCase = new UserCreatorUseCase(userRepository)
  const user: User = {
    age: 28,
    id: '1',
    name: 'Samuel',
    username: 'jst.samuel'
  }
  await userCreatorUseCase.run(user)
  info(user)

  try {
    await userCreatorUseCase.run(user)
  } catch (e) {
    if (e instanceof UserAlreadyExistsException) {
      error(e)
    }
  }

  const userGetterUseCase = new UserGetterUseCase(userRepository)
  let users = await userGetterUseCase.run()
  info(users)

  const userUpdaterUseCase = new UserUpdaterUseCase(userRepository)
  await userUpdaterUseCase.run({
    id: '2',
    name: 'Samuel updated'
  })

  users = await userGetterUseCase.run()
  info(users)

  const userDeleteUseCase = new UserDeleteUseCase(userRepository)
  await userDeleteUseCase.run(users[users.length - 1].id)

  users = await userGetterUseCase.run()
  info(users)

  await MongoDB?.client?.close()
}

bootstrap()
