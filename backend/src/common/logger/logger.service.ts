import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common'
import * as winston from 'winston'

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: 'samaplanner-backend' },
      transports: [
        // Console transport with colorized output for development
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
              const contextStr = context ? `[${context}]` : ''
              const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : ''
              return `${timestamp} ${level} ${contextStr} ${message} ${metaStr}`
            })
          ),
        }),
        // File transport for errors
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.json(),
        }),
        // File transport for all logs
        new winston.transports.File({
          filename: 'logs/combined.log',
          format: winston.format.json(),
        }),
      ],
    })
  }

  log(message: string, context?: string, meta?: any) {
    this.logger.info(message, { context, ...meta })
  }

  error(message: string, trace?: string, context?: string, meta?: any) {
    this.logger.error(message, { trace, context, ...meta })
  }

  warn(message: string, context?: string, meta?: any) {
    this.logger.warn(message, { context, ...meta })
  }

  debug(message: string, context?: string, meta?: any) {
    this.logger.debug(message, { context, ...meta })
  }

  verbose(message: string, context?: string, meta?: any) {
    this.logger.verbose(message, { context, ...meta })
  }
}

