import convict from 'convict'

const moocConfic = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'staging', 'test'],
    default: 'default',
    env: 'NODE_ENV'
  },
  mongo: {
    url: {
      doc: 'The MongoDB connection URL.',
      format: String,
      env: 'MONGO_URL',
      default: 'mongodb://localhost:27017/mooc'
    }
  }
})

moocConfic.loadFile([`${__dirname}/default.json`, `${__dirname}/${moocConfic.get('env')}.json`])

export default moocConfic
