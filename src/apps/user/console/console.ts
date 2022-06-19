import dotenv from 'dotenv'
import { expand } from 'dotenv-expand'

import { MongoDB } from '@/contexts/shared/infrastructure/persistance/mongo/mongodb'
import { UserCreatorUseCase } from '@/contexts/user/users/application/user.creator'
import { UserDeleteUseCase } from '@/contexts/user/users/application/user.delete'
import { UserGetterUseCase } from '@/contexts/user/users/application/user.getter'
import { UserUpdaterUseCase } from '@/contexts/user/users/application/user.updater'
import { User } from '@/contexts/user/users/domain/user'
import { MongoDBUserRepository } from '@/contexts/user/users/infrastructure/persistance/mongodb-user.repository'
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
    username: 'username',
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

  await MongoDB?.client?.close()

  process.exit(0)
}

bootstrap()
