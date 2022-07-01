import { makeExecutableSchema } from '@graphql-tools/schema'
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

import resolvers from './resolvers'

const gqlFiles = readdirSync(join(__dirname, './typedefs'))

let typeDefs = ''

gqlFiles.forEach((file) => {
  typeDefs += readFileSync(join(__dirname, './typedefs', file), {
    encoding: 'utf8'
  })
})

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default schema
