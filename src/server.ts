import mongoose from 'mongoose';
import app from './app';
import config from './config';
import { errorLogger, logger } from './shared/logger';
import { Server } from 'http';

process.on("uncaughtException",error => {
  errorLogger.error(error);
  process.exit(1);
})

let server: Server;

const bootstrap = async () => {
  const { database_url, port } = config;

  try {
    await mongoose.connect(database_url as string);
    logger.info('🛢️  Database connection successful');
    server = app.listen(port, () => {
      logger.info(`✅ app listening on port ${port}`);
    });
  } catch (err) {
    errorLogger.error('Failed to connect database ', err);
  }

  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        errorLogger.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
};

bootstrap();

process.on("SIGTERM", () => {
  logger.info("SIGTERM is received");
  if(server){
    server.close();
  }
})
