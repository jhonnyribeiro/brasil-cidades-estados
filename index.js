console.log('JS Running...');

import express from 'express';
import { promises } from 'fs';
import winston from 'winston';

const readFile = promises.readFile;
const writeFile = promises.writeFile;

const app = express();

app.use(express.json());
const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'brasil-estados-cidades-api.log' }),
  ],
  format: combine(
    label({ label: 'brasil-estados-cidades-api' }),
    timestamp(),
    myFormat
  ),
});

app.listen(3000, async () => {
  console.log('API Running...');
  logger.info('API Running...');
});

app.get('/test', (req, res) => {
  res.send('API Running... GET Method');
  logger.info('GET /test - API Running...');
});
