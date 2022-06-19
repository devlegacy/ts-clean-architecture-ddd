export interface User {
  id: string
  name: string
  username: string
  age: number
}
// Note: No acoplar a un modelo

export interface UserUpdateDto extends Omit<Partial<User>, 'id'> {
  id: User['id']
}
