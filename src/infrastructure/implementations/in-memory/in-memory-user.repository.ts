import { User } from '@/domain/entities/user'
import { UserRepository } from '@/domain/repositories/user.repository'

export class InMemoryUserRepository implements UserRepository {
  private usersData: User[] = []

  async getAll(): Promise<User[]> {
    return this.usersData
  }

  async save(user: User): Promise<User> {
    this.usersData.push(user)

    return user
  }

  async getByUserName(username: string): Promise<User | null> {
    const userFound = this.usersData.find((user: User) => user.username === username)
    if (userFound === undefined) return null
    return userFound
  }

  async update(user: User): Promise<User> {
    const users = this.usersData.filter((userData) => userData.id !== user.id)
    users.push(user)
    this.usersData = users

    return user
  }

  async delete(user: User): Promise<void> {
    const users = this.usersData.filter((userData) => userData.id !== user.id)
    this.usersData = users
  }

  async getById(id: string): Promise<User | null> {
    const user = this.usersData.find((userData) => userData.id === id)
    return user || null
  }
}
