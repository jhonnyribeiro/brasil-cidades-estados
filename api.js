console.log('JS Running...');

import express from 'express';
import { promises } from 'fs';
import winston from 'winston';
import { get } from 'http';

const readFile = promises.readFile;
const writeFile = promises.writeFile;
const allStates = [];
const allCities = [];

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

async function getStates() {
  try {
    let data = await readFile(fileNameStates, 'utf-8');
    let json = JSON.parse(data);
    json.forEach((state) => {
      allStates.push({ id: state.ID, uf: state.Sigla, name: state.Nome });
    });
    //  console.log(allStates);
    return allStates;
    // for (let i = 0; i < allStates.length; i++) {
    //   console.log(allStates[i].Nome + ' ' + i);
    // }

    // console.log(data);
    logger.info(
      'function getStates - arquivo lido com sucesso! Nome do Arquivo: ' +
        fileNameStates
    );
  } catch (error) {
    console.log(error.message);
    logger.error(`function getStates - ${error.message}`);
  }
}
async function getCities() {
  try {
    let data = await readFile(fileNameCities, 'utf-8');
    let json = JSON.parse(data);
    json.forEach((city) => {
      allCities.push({ id: city.ID, uf: city.Estado, name: city.Nome });
    });
    console.log(allCities);
    return allCities;
    // for (let i = 0; i < allStates.length; i++) {
    //   console.log(allStates[i].Nome + ' ' + i);
    // }

    // console.log(data);
    logger.info(
      'function getCities - arquivo lido com sucesso! Nome do Arquivo: ' +
        fileNameStates
    );
  } catch (error) {
    console.log(error.message);
    logger.error(`function getStates - ${error.message}`);
  }
}

async function getCitiesByState() {
  const cities = getCities();
  let stateReturn = (await cities).find((city) => {
    city.name == cities.name;
  });
  console.log(stateReturn);
  return stateReturn;
}

async function getIdStateByUf(ufFilter) {
  await getStates();
  try {
    await allStates.find((state) => {
      state.name == ufFilter;
    });
  } catch (error) {}
}
// getStates();
//getCities();

console.log(getIdStateByUf('ES'));
