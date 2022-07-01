import { Db, MongoClient } from 'mongodb'

export class MongoDB {
  private static instance: Db | null = null
  static client: MongoClient | null = null

  private constructor() {
    // Private constructor
  }

  public static async getInstance(): Promise<Db> {
    if (!MongoDB.instance) {
      const {
        DB_USERNAME = '',
        DB_PORT = 27017,
        DB_HOST = 'localhost',
        DB_PASSWORD = '',
        DB_DATABASE = 'ts-clean-architecture'
      } = process.env
      const isLocalHost = ['localhost', '127.0.0.1'].includes(DB_HOST)

      const USER = encodeURIComponent(DB_USERNAME) // (DB_USERNAME ?? '') // sample of ??
      const PASSWORD = encodeURIComponent(DB_PASSWORD)

      const PROTOCOL = isLocalHost ? 'mongodb' : 'mongodb+srv'
      const CREDENTIALS = isLocalHost ? '' : `${USER}:${PASSWORD}@`
      const HOST = `${DB_HOST}${isLocalHost ? `:${DB_PORT}` : ''}`
      const OPTIONS = `readPreference=primary&connectTimeoutMS=10000&retryWrites=true&w=majority${
        isLocalHost ? '&ssl=false' : ''
      }`

      const MONGO_URL = `${PROTOCOL}://${CREDENTIALS}${HOST}/${DB_DATABASE}?${OPTIONS}`
      const client = new MongoClient(MONGO_URL)
      await client.connect()
      MongoDB.instance = client.db(DB_DATABASE, {
        ignoreUndefined: true
      })

      MongoDB.client = client
    }

    return MongoDB.instance
  }
}
