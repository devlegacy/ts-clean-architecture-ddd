import MongoConfig from '@/contexts/shared/infrastructure/persistance/mongo/mongo-config'

import config from '../../config'

const mongoConfig: MongoConfig = {
  url: config.get('mongo.url')
}

export class MongoConfigFactory {
  static createConfig(): MongoConfig {
    return mongoConfig
  }
}
