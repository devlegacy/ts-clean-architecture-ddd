import { userMutation, userQueries } from './users'

const resolvers = {
  Query: {
    ...userQueries
  },
  Mutation: {
    ...userMutation
  }
}

export default resolvers
