import { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify'
import { v4 as uuidv4 } from 'uuid'

import { UserCreatorUseCase } from '@/application/usecases/user-creator'
import { UserDeleteUseCase } from '@/application/usecases/user-delete'
import { UserGetterUseCase } from '@/application/usecases/user-getter'
import { UserUpdaterUseCase } from '@/application/usecases/user-updater'
import { MongoDB } from '@/infrastructure/driven-adapters/mongodb'
import { MongoDBUserRepository } from '@/infrastructure/implementations/mongo/mongodb-user.repository'

export const UserController = (fastify: FastifyInstance, opts: unknown, done: HookHandlerDoneFunction) => {
  fastify
    .get('/api/users', async (req: FastifyRequest, res: FastifyReply) => {
      try {
        const database = await MongoDB.getInstance()
        const mongoDbUserRepository = new MongoDBUserRepository(database)
        const userGetterUseCase = new UserGetterUseCase(mongoDbUserRepository)
        const users = await userGetterUseCase.run()
        res.code(200)

        return users
      } catch (e: any) {
        res.code(500)
        return {
          message: 'Internal error',
          stack: e.stack
        }
      }
    })
    .get('/api/users/:user', async (req: FastifyRequest, res: FastifyReply) => {
      try {
        res.code(200)
        return {}
      } catch (e: any) {
        res.code(500)
        return {
          message: 'Internal error',
          stack: e.stack
        }
      }
    })
    .post('/api/users', async (req: FastifyRequest<{ Body: any }>, res: FastifyReply) => {
      try {
        const { username, age, name } = req.body
        const database = await MongoDB.getInstance()
        const mongoDbUserRepository = new MongoDBUserRepository(database)
        const userCreatorUseCase = new UserCreatorUseCase(mongoDbUserRepository)
        const user = {
          id: uuidv4(),
          username,
          age,
          name
        }

        res.code(201)

        return await userCreatorUseCase.run(user)
      } catch (e: any) {
        res.code(500)
        return {
          message: 'Internal error',
          stack: e.stack
        }
      }
    })
    .put('/api/users/:user', async (req: FastifyRequest<{ Body: any; Params: any }>, res: FastifyReply) => {
      try {
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

        res.code(200)

        return await userUpdaterUseCase.run(user)
      } catch (e: any) {
        res.code(500)
        return {
          message: 'Internal error',
          stack: e.stack
        }
      }
    })
    .delete('/api/users/:user', async (req: FastifyRequest<{ Params: any }>, res: FastifyReply) => {
      try {
        const userId = req.params.user
        const database = await MongoDB.getInstance()
        const mongoDbUserRepository = new MongoDBUserRepository(database)
        const userDeleteUseCase = new UserDeleteUseCase(mongoDbUserRepository)

        res.code(200)

        return await userDeleteUseCase.run(userId)
      } catch (e: any) {
        res.code(500)
        return {
          message: 'Internal error',
          stack: e.stack
        }
      }
    })
  done()
}
