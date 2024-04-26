import { createLogger, format, transports } from 'winston';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure the logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logConfiguration = {
    'transports': [
        new transports.Console({
            level: 'debug', // Changed level to 'debug' to ensure console logging is always enabled for debugging purposes
            format: format.combine(
                format.colorize(),
                format.simple()
            )
        }),
        new transports.File({
            level: 'error',
            filename: path.join(__dirname, '../logs/error.log'),
            format: format.combine(
                format.timestamp(),
                format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
                format.errors({ stack: true }) // Ensure stack trace is logged
            )
        }),
        new transports.File({
            level: 'info',
            filename: path.join(__dirname, '../logs/combined.log'),
            format: format.combine(
                format.timestamp(),
                format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
                format.json()
            )
        }),
        new transports.File({
            level: 'debug',
            filename: path.join(__dirname, '../logs/app.log'),
            format: format.combine(
                format.timestamp(),
                format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
                format.json()
            )
        })
    ],
    exceptionHandlers: [
        new transports.File({ 
            filename: path.join(__dirname, '../logs/exceptions.log'),
            format: format.combine(
                format.timestamp(),
                format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
                format.json()
            )
        })
    ],
    rejectionHandlers: [
        new transports.File({ 
            filename: path.join(__dirname, '../logs/rejections.log'),
            format: format.combine(
                format.timestamp(),
                format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
                format.json()
            )
        })
    ]
};

const logger = createLogger(logConfiguration);

export { logger };