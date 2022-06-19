import { Collection, Db } from 'mongodb'

import { User, UserUpdateDto } from '@/contexts/user/users/domain/user'
import { UserRepository } from '@/contexts/user/users/domain/user.repository'

export class MongoDBUserRepository implements UserRepository {
  private readonly user: Collection<User>
  private readonly _db: Db
  constructor(database: Db) {
    this._db = database
    this.user = this._db.collection('users')
  }

  async getAll(): Promise<User[]> {
    const users = await this.user.find().toArray()
    return users
  }

  async save(userDto: User): Promise<User> {
    const user = await this.user.insertOne(userDto)
    if (user.insertedId) {
      const userFromDatabase = await this.user.findOne({ _id: user.insertedId })
      return userFromDatabase ?? userDto
    }
    return userDto
  }

  async getByUserName(username: string): Promise<User | null> {
    const user = await this.user.findOne({ username })
    return user
  }

  async update(userDto: UserUpdateDto): Promise<User> {
    const { id, ...data } = userDto
    const user = await this.user.updateOne({ id }, { $set: data }, { upsert: true })

    if (user.modifiedCount) {
      const userFromDatabase = await this.user.findOne({ id })
      return (userFromDatabase ?? userDto) as User
    }

    return userDto as User
  }

  async delete(user: User): Promise<void> {
    this.user.deleteOne({ id: user.id })
  }

  async getById(id: string): Promise<User | null> {
    const user = await this.user.findOne({ id })
    return user
  }
}
