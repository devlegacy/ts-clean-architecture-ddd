import dotenv from 'dotenv'
import { expand } from 'dotenv-expand'

import { UserCreatorUseCase } from '@/application/usecases/user-creator'
import { UserDeleteUseCase } from '@/application/usecases/user-delete'
import { UserGetterUseCase } from '@/application/usecases/user-getter'
import { UserUpdaterUseCase } from '@/application/usecases/user-updater'
import { User } from '@/domain/entities/user'
import { MongoDB } from '@/infrastructure/driven-adapters/mongodb'
import { MongoDBUserRepository } from '@/infrastructure/implementations/mongo/mongodb-user.repository'
// import { InMemoryUserRepository } from '@/infrastructure/implementations/in-memory/in-memory-user.repository'

const bootstrap = async () => {
  const config = dotenv.config()
  expand(config)

  // const inMemoryUserRepository = new InMemoryUserRepository()
  const database = await MongoDB.getInstance()
  const mongoDbUserRepository = new MongoDBUserRepository(database)
  const userCreatorUseCase = new UserCreatorUseCase(mongoDbUserRepository)
  const user: User = {
    name: 'Samuel',
    age: 28,
    username: '',
    id: '1'
  }
  await userCreatorUseCase.run(user)
  console.log(user)

  const userGetterUseCase = new UserGetterUseCase(mongoDbUserRepository)
  let users = await userGetterUseCase.run()
  console.log(users)

  const userUpdaterUseCase = new UserUpdaterUseCase(mongoDbUserRepository)
  await userUpdaterUseCase.run({
    id: '1',
    name: 'Samuel Updated'
  })

  users = await userGetterUseCase.run()
  console.log(users)

  const userDeleteUseCase = new UserDeleteUseCase(mongoDbUserRepository)
  await userDeleteUseCase.run('1')

  users = await userGetterUseCase.run()
  console.log(users)
}

bootstrap()
