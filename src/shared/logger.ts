import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, label, printf, prettyPrint } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  const date = new Date(timestamp as Date);
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${date.toDateString()}:${hour}:${minute}:${second} [${label}] ${level}: ${message}`;
});

// SUCCESS LOGS
const logger = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'Shadi Mubarak' }),
    timestamp(),
    myFormat,
    // prettyPrint()
  ),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        '/logs/winston/successes/shadi-mubarak-%DATE%-success.log'
      ),
      datePattern: 'YYYY-DD-MM-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

// ERROR LOGS
const errorLogger = createLogger({
  level: 'error',
  format: combine(
    label({ label: 'Shadi Mubarak!' }),
    timestamp(),
    myFormat,
    prettyPrint()
  ),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        '/logs/winston/errors/shadi-mubarak-%DATE%-error.log'
      ),
      datePattern: 'YYYY-DD-MM-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

export { logger, errorLogger };
