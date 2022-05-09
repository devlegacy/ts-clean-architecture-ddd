import dotenv from 'dotenv'
import { expand } from 'dotenv-expand'

import { BackendApp } from './backend-app'

// import { MongoDB } from '@/infrastructure/driven-adapters/mongodb'

try {
  const config = dotenv.config()
  expand(config)
  // const database = await MongoDB.getInstance()

  new BackendApp().start()
} catch (e) {
  console.error(e)
}
