import { Uuid } from '@/contexts/shared/domain/value-object/uuid'

export class Course {
  readonly id!: Uuid
  readonly name!: string
  readonly duration?: string

  // constructor({ id, name, duration }: { id: string; name: string; duration: string }) {
  constructor(dto: { id: Uuid; name: string; duration?: string }) {
    // this.id = id
    // this.name = name
    // this.duration = duration
    Object.assign(this, dto)
  }
}
