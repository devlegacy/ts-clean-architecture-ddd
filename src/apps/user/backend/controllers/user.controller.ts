import { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify'
import { v4 as uuidv4 } from 'uuid'

import { MongoDB } from '@/contexts/shared/infrastructure/persistance/mongo/mongodb'
import { UserCreatorUseCase } from '@/contexts/user/users/application/user.creator'
import { UserDeleteUseCase } from '@/contexts/user/users/application/user.delete'
import { UserGetterUseCase } from '@/contexts/user/users/application/user.getter'
import { UserUpdaterUseCase } from '@/contexts/user/users/application/user.updater'
import { MongoDBUserRepository } from '@/contexts/user/users/infrastructure/persistance/mongodb-user.repository'

export const UserController = (fastify: FastifyInstance, opts: unknown, done: HookHandlerDoneFunction) => {
  fastify
    .get('/users', async (req: FastifyRequest, res: FastifyReply) => {
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
    .get('/users/:user', async (req: FastifyRequest, res: FastifyReply) => {
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
    .post('/users', async (req: FastifyRequest<{ Body: any }>, res: FastifyReply) => {
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
    .put('/users/:user', async (req: FastifyRequest<{ Body: any; Params: any }>, res: FastifyReply) => {
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
    .delete('/users/:user', async (req: FastifyRequest<{ Params: any }>, res: FastifyReply) => {
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
