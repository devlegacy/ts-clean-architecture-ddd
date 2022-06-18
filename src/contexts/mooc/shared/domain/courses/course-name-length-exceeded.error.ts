export class CourseNameLengthExceeded extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CourseNameLengthExceeded'
  }
}
