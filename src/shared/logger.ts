import { resolve } from 'path'
import pino, { LoggerOptions } from 'pino'
import pretty from 'pino-pretty'
import { cwd } from 'process'
import util from 'util'

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
export let logger = () =>
  pino(
    {
      name: process.env.APP_NAME,
      level: process.env.LOG_LEVEL || 'info'
    },
    pino.multistream(streams)
  )

export const fatalErrorHandler = (err: Error, ..._args: Array<unknown>) => {
  logger().error(err)
  process.exit(1)
}

export const deepLogger = (data: object) =>
  logger().info(
    util.inspect(data, {
      showHidden: false,
      depth: null,
      colors: true
    })
  )

export const configure = (config: LoggerOptions) => {
  logger = () => pino(config)
}

export const info = logger().info.bind(logger())
export const warn = logger().warn.bind(logger())
export const debug = logger().debug.bind(logger())
export const fatal = logger().fatal.bind(logger())
export const error = logger().error.bind(logger())
