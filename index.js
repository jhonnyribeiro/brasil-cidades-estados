console.log('JS Running...');

import express from 'express';
import { promises } from 'fs';

const readFile = promises.readFile;
const writeFile = promises.writeFile;

const app = express();

app.use(express.json());

app.listen(3000, async () => {
  console.log('API Running...');
});

app.get('/test', (req, res) => {
  res.send('API Running... GET Method');
});
