import { exit } from 'process'
import { container } from 'tsyringe'

import { CourseRepository } from '@/contexts/mooc/courses/domain/course.repository'
import { FileCourseRepository } from '@/contexts/mooc/courses/infrastructure/persistance/file-course.repository'

import { Server } from './server'

export class MoocBackendApp {
  server?: Server

  get httpServer() {
    return this.server?.getHttpServer()
  }

  async start() {
    // TODO: Inject dependencies or create dependency injector
    container.register<CourseRepository>('CourseRepository', { useClass: FileCourseRepository })

    const port = +(process.env.APP_PORT || 8080)
    this.server = new Server(port)
    return await this.server.listen()
  }

  async stop() {
    await this.server?.stop()
    exit(0)
  }
}
