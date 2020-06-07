import { promises } from 'fs';

const { readFile, writeFile } = promises;

let globalStates = null;
let globalCities = null;
let globalStatesAndCities = null;

const allStates = [];
const allCities = [];
const totalCitiesState = [];

async function start() {
  console.log('started...');
  await fetchStates();
  await fetchCities();
  await mergeStatesAndCities();
  await createStateFiles();
  await searchStateByLabel('ES');
  await totalCitiesByState('ES');
  console.log(globalStates.length);
  console.log(globalCities.length);
  await countTotalCitiesState();
  await fiveStateWithMoreCities();
  await fiveStateWithLessCities();
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
  // console.log(globalStatesAndCities);
}

async function createStateFiles() {
  console.log('createStateFiles');
  globalStates.forEach((file) => {
    // console.log(file.stateLabel);

    let cityState = [];
    var totalCities = null;
    globalCities.forEach((city) => {
      // console.log(city);
      if (city.citiesState === file.stateId) {
        cityState.push({
          cityName: city.citiesName,
          nameLength: city.citiesName.length,
        });
        totalCities++;
      }
    });
    // console.log(cityState);
    totalCitiesState.push({ state: file.stateLabel, totalCities: totalCities });
    writeFile(file.stateLabel + '.json', JSON.stringify(cityState));
  });
}

async function searchStateByLabel(labelToSearch) {
  try {
    let data = [];
    data = await readFile(labelToSearch + '.json', 'utf8');
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function totalCitiesByState(labelToSearch) {
  try {
    let data = [];
    let citiesByState = [];
    data = await readFile(labelToSearch + '.json', 'utf8');
    const json = JSON.parse(data);
    let index = null;
    json.forEach((e) => {
      citiesByState.push(e.cityName);
      index++;
    });
    //   console.log(index);
  } catch (error) {
    console.log(error);
  }
}

async function countTotalCitiesState() {
  // orderna
  //console.log(totalCitiesState);
  totalCitiesState.sort((a, b) => {
    return b.totalCities - a.totalCities;
  });
  // for (let i = 0; i < 5; i++) {
  //   console.log(totalCitiesState[i]);
  // }

  // console.log(totalCitiesState);
}

async function fiveStateWithMoreCities() {
  totalCitiesState.sort((a, b) => {
    return b.totalCities - a.totalCities;
  });
  for (let i = 0; i < 5; i++) {
    console.log(totalCitiesState[i]);
  }
}

async function fiveStateWithLessCities() {
  totalCitiesState.sort((a, b) => {
    return a.totalCities - b.totalCities;
  });
  for (let i = 0; i < 5; i++) {
    console.log(totalCitiesState[i]);
  }
}
start();
