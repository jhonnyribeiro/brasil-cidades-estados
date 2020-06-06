import { promises } from 'fs';

const { readFile, writeFile } = promises;

let globalStates = null;
let globalCities = null;
let globalStatesAndCities = null;

const allStates = [];
const allCities = [];

async function start() {
  console.log('started...');
  await fetchStates();
  await fetchCities();
  await mergeStatesAndCities();
  await createStateFiles();
  console.log(globalStates.length);
  console.log(globalCities.length);
}

async function fetchStates() {
  try {
    const states = await readFile('./Estados.json');

    const dataStates = JSON.parse(states);

    globalStates = dataStates.map(({ ID, Sigla, Nome }) => {
      return {
        stateId: ID,
        stateLabel: Sigla,
        stateName: Nome,
      };
    });

    // console.log(dataStates);
  } catch (error) {
    console.log(error);
  }
}

async function fetchCities() {
  try {
    const cities = await readFile('./Cidades.json');

    const dataCities = JSON.parse(cities);

    globalCities = dataCities.map(({ ID, Nome, Estado }) => {
      return {
        citiesId: ID,
        citiesName: Nome,
        citiesState: Estado,
      };
    });

    // console.log(dataCities);
  } catch (error) {
    console.log(error);
  }
}

async function mergeStatesAndCities() {
  globalStatesAndCities = [];

  globalCities.forEach((city) => {
    const cityState = globalStates.find((state) => {
      return state.stateId === city.citiesState;
    });

    globalStatesAndCities.push({ ...city, ...cityState });
  });
  //  console.log(globalStatesAndCities);
}

async function createStateFiles() {
  console.log('createStateFiles');
  globalStates.forEach((file) => {
    console.log(file.stateLabel);

    let cityState = [];
    globalCities.forEach((city) => {
      // console.log(city);
      if (city.citiesState === file.stateId) {
        cityState.push({ cityName: city.citiesName });
      }
    });
    // console.log(cityState);

    writeFile(file.stateLabel + '.json', JSON.stringify(cityState));
  });
}

start();