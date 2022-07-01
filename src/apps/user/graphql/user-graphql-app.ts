import { MongoDB } from '@/contexts/shared/infrastructure/persistance/mongo/mongodb'

import { GraphQL } from './graphql'

export class UserGraphQLApp {
  graphQL?: GraphQL

  async start() {
    const APP_PORT = 2427
    this.graphQL = new GraphQL(APP_PORT)
    await MongoDB.getInstance()
    return await this.graphQL.listen()
  }

  stop() {
    this.graphQL?.stop()
  }
}
