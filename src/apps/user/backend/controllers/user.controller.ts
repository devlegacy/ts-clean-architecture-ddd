import { FastifyInstance, HookHandlerDoneFunction } from 'fastify'
import HttpStatus from 'http-status'

import { MongoDB } from '@/contexts/shared/infrastructure/persistance/mongo/mongodb'
import {
  MongoDBUserRepository,
  UserCreatorUseCase,
  UserDeleteUseCase,
  UserGetterUseCase,
  UserUpdaterUseCase
} from '@/contexts/user'

export const UserController = (fastify: FastifyInstance, opts: unknown, done: HookHandlerDoneFunction) => {
  fastify
    .get('/users', async (req: HttpRequest, res: HttpResponse) => {
      const database = await MongoDB.getInstance()
      const mongoDbUserRepository = new MongoDBUserRepository(database)
      const userGetterUseCase = new UserGetterUseCase(mongoDbUserRepository)
      const users = await userGetterUseCase.run()
      res.code(HttpStatus.OK)

      return users
    })
    .get('/users/:user', async (req: HttpRequest, res: HttpResponse) => {
      res.code(200)
      return {}
    })
    .post(
      '/users',
      async (req: HttpRequest<{ Body: { username: string; age: number; name: string } }>, res: HttpResponse) => {
        const database = await MongoDB.getInstance()
        const mongoDbUserRepository = new MongoDBUserRepository(database)
        const userCreatorUseCase = new UserCreatorUseCase(mongoDbUserRepository)

        const { username, age, name } = req.body
        const user = {
          username,
          age,
          name
        }

        res.code(HttpStatus.CREATED)

        return await userCreatorUseCase.run(user)
      }
    )
    .put(
      '/users/:user',
      async (
        req: HttpRequest<{
          Body: { username: string; age: number; name: string }
          Params: { user: string }
        }>,
        res: HttpResponse
      ) => {
        const { username, age, name } = req.body
        const database = await MongoDB.getInstance()
        const mongoDbUserRepository = new MongoDBUserRepository(database)
        const userUpdaterUseCase = new UserUpdaterUseCase(mongoDbUserRepository)

        const userId = req.params.user
        const user = {
          id: userId,
          username,
          age,
          name
        }

        res.code(HttpStatus.OK)

        return await userUpdaterUseCase.run(user)
      }
    )
    .delete('/users/:user', async (req: HttpRequest<{ Params: { user: string } }>, res: HttpResponse) => {
      const userId = req.params.user
      const database = await MongoDB.getInstance()
      const mongoDbUserRepository = new MongoDBUserRepository(database)
      const userDeleteUseCase = new UserDeleteUseCase(mongoDbUserRepository)

      res.code(HttpStatus.OK)

      return await userDeleteUseCase.run(userId)
    })
  done()
}
