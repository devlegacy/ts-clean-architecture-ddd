import { MongoDB } from '@/contexts/shared/infrastructure/persistance/mongo/mongodb'
import { MongoDBUserRepository, UserCreatorUseCase } from '@/contexts/user'

const userMutations = {
  createUser: async (_: any, args: any) => {
    const database = await MongoDB.getInstance()
    const mongoDbUserRepository = new MongoDBUserRepository(database)
    const userCreatorUseCase = new UserCreatorUseCase(mongoDbUserRepository)

    const {
      user: { username, age, name }
    } = args

    const user = {
      username,
      age,
      name
    }

    return await userCreatorUseCase.run(user)
  }
}

export default userMutations
