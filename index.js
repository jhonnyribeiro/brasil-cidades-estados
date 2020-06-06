console.log('JS Running...');

import express from 'express';
import { promises } from 'fs';
import winston from 'winston';

const readFile = promises.readFile;
const writeFile = promises.writeFile;

global.fileNameCities = 'Cidades.json';
global.fileNameStates = 'Estados.json';

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

app.get('/states', async (_, res) => {
  try {
    let data = await readFile(fileNameStates, 'utf-8');
    let json = JSON.parse(data);
    res.send(json);

    logger.info(
      'GET /states - arquivo lido com sucesso! Nome do Arquivo: ' +
        fileNameStates
    );
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ error: err.message });
    logger.error(`GET /states - ${error.message}`);
  }
});
