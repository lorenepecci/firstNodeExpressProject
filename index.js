const express = require('express');
const bodyParser = require('body-parser');
const { readFileFunc, writeFileFunc, putOrPostWriteFile } = require('./helpers/fs');
const { generateToken } = require('./helpers/generateToken');
const { validationEmailAndPassword } = require('./middlewares/validationEmailAndPassword');
const { autenticated } = require('./middlewares/autenticated');
const { validateParameters, validIfExists, validateTalk } = require('./middlewares/validatePost');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const file = 'talker.json';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.post('/login', validationEmailAndPassword, (_req, res) => {
  const token = generateToken();
  res.status(200).json({ token });
}); 

app.get('/talker', async (_req, res) => {
  const object = await readFileFunc(file);
  res.status(200).json(object);
});

app.get('/talker/search', autenticated, async (req, res) => {
  const { q } = req.query;
  const data = await readFileFunc(file);
  if (!q) {
    return res.status(200).json(data);
  }
  const filterData = data.filter((obj) => obj.name.includes(q));
  if (filterData.length) {
    return res.status(200).json(filterData);
  }
  return res.status(200).json([]);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const data = await readFileFunc(file);
  const findObj = data.find((obj) => obj.id === Number(id));
  if (!findObj) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(200).json(findObj);
});

app.post('/talker', autenticated, validIfExists, validateParameters,
  validateTalk, async (req, res) => {
  const objNew = await putOrPostWriteFile(file, req.body, null);
  return res.status(201).json(objNew); 
});

app.put('/talker/:id', autenticated, validIfExists, validateParameters, validateTalk,
  async (req, res) => {
  const { id } = req.params;
  const data = await readFileFunc(file);
  const findObj = data.find((obj) => obj.id === Number(id));
  if (!findObj) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  const objNew = await putOrPostWriteFile(file, req.body, Number(id));
  return res.status(200).json(objNew); 
  });

app.delete('/talker/:id', autenticated, async (req, res) => {
  const { id } = req.params;
  const data = await readFileFunc(file);
  const filterData = data.filter((obj) => obj.id !== Number(id));
  await writeFileFunc(file, filterData);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log('Online');
});
