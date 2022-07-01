import { User } from '@/contexts/user/users/domain/user'
import { UserRepository } from '@/contexts/user/users/domain/user.repository'

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = []

  async getAll(): Promise<User[]> {
    return this.users
  }

  async save(user: User): Promise<User> {
    this.users.push(user)

    return user
  }

  async getByUserName(username: string): Promise<User | null> {
    const user = this.users.find((user: User) => user.username === username)
    if (!user) return null
    return user
  }

  async update(user: User): Promise<User> {
    const users = this.users.filter(({ id }) => id !== user.id)
    users.push(user)
    this.users = users

    return user
  }

  async delete(user: User): Promise<void> {
    const users = this.users.filter(({ id }) => id !== user.id)
    this.users = users
  }

  async getById(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.id === id)
    return user || null
  }
}
