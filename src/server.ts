import mongoose from 'mongoose'
import app from './app'
import config from './config'
import { errorLogger, logger } from './shared/logger'

const main = async () => {
  const { database_url, port } = config

  try {
    await mongoose.connect(database_url as string)
    logger.info("Database connection successful")
    app.listen(port, () => {
      logger.info(`app listening on port ${port}`)
    })
  } catch (err) {
    errorLogger.error('Failed to connect database ', err)
  }
}

main()
