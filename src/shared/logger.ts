import { resolve } from 'path'
import pino from 'pino'
import pretty from 'pino-pretty'
import { cwd } from 'process'

const stream = pretty({
  colorize: true, // colorizes the log
  levelFirst: true,
  translateTime: 'yyyy-dd-mm, h:MM:ss TT',
  ignore: 'pid,hostname'
})

// const name = process.env.APP_NAME || 'Default microservice'
// const level = process.env.LOG_LEVEL || 'info'
const streams = [{ stream }, { stream: pino.destination(resolve(cwd(), './logger.log')) }]

/**
 * Read more on: https://getpino.io/#/
 */
export const logger = () =>
  pino(
    {
      name: process.env.APP_NAME || 'Default microservice',
      level: process.env.LOG_LEVEL || 'info'
    },
    pino.multistream(streams)
  )

export const fatalErrorHandler = (err: Error, ..._args: Array<unknown>) => {
  logger().error(err)
  process.exit(1)
}
