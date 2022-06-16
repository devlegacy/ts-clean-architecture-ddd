import { Course } from './course'

// TODO: Define
export const TOKEN = 'CourseRepository'
export const KEY = 'CourseRepository'

export interface CourseRepository {
  save(course: Course): Promise<void>
}
